import { BungieToken, getAccessTokenFromRefreshToken } from "bungie-net-core/lib/auth"
import { getMembershipDataForCurrentUser } from "bungie-net-core/lib/endpoints/User"
import { GeneralUser as BungieUser, GroupUserInfoCard } from "bungie-net-core/lib/models"
import { OAuthConfig, OAuthProvider } from "next-auth/providers/oauth"
import BungieClient from "../../../services/bungie/client"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { User as PrismaUser, Account as PrismaAccount } from "@prisma/client"
import NextAuth from "next-auth/next"
import { DefaultSession } from "next-auth"

type AuthError = "RefreshAccessTokenError" | "ExpiredRefreshTokenError"

declare module "next-auth" {
    interface Session extends DefaultSession {
        error?: AuthError
        token?: BungieToken & { type: "access" }
    }
    interface User extends PrismaUser {}
}

declare module "next-auth" {
    interface Profile extends BungieUser, GroupUserInfoCard {}
}

const prismaClient = new PrismaClient()
const prismaAdapter = PrismaAdapter(prismaClient)
const _link = prismaAdapter.linkAccount
prismaAdapter.linkAccount = data => {
    // cleans properties that shouldnt be here
    return _link({
        userId: data.userId,
        type: data.type,
        provider: data.provider,
        providerAccountId: data.providerAccountId,
        refresh_token: data.refresh_token!,
        access_token: data.access_token!,
        expires_at: data.expires_at!,
        token_type: data.token_type!,
        scope: data.scope!,
        id_token: data.id_token!,
        session_state: data.session_state!
    } satisfies Omit<PrismaAccount, "id">)
}

const BungieProvider: OAuthProvider = options => {
    return {
        id: "bungie",
        name: "Bungie",
        type: "oauth",
        authorization: {
            url: "https://www.bungie.net/en/OAuth/Authorize",
            params: { scope: "" }
        },
        token: "https://www.bungie.net/platform/app/oauth/token/",
        // Correctly gets the current user info so that the existing `profile` definition works
        userinfo: {
            // passed to profile(profile)
            request: async ({ tokens }) => ({
                ...tokens,
                ...(await getBungieMembershipData(tokens.access_token!))
            })
        },
        profile(profile) {
            return {
                id: profile.membershipId,
                name: profile.displayName,
                destinyMembershipType: profile.membershipType,
                image: `https://www.bungie.net${
                    profile.profilePicturePath.startsWith("/") ? "" : "/"
                }${profile.profilePicturePath}`,
                refresh_token: profile.refresh_token,
                refresh_expires_at: new Date(Date.now() + 7_776_000_000),
                email: null,
                emailVerified: null
            } satisfies PrismaUser
        },
        options: options as Required<Pick<OAuthConfig<any>, "clientId" | "clientSecret">>
    }
}

async function getBungieMembershipData(accessToken: string) {
    const client = new BungieClient()
    client.setToken(accessToken)

    const { bungieNetUser, destinyMemberships, primaryMembershipId } =
        await getMembershipDataForCurrentUser(client).then(res => res.Response)

    return {
        ...bungieNetUser,
        ...(destinyMemberships.find(
            membership => membership.membershipId === primaryMembershipId
        ) ?? destinyMemberships[0])
    }
}

export default NextAuth({
    adapter: prismaAdapter,
    providers: [
        BungieProvider({
            clientId: process.env.BUNGIE_CLIENT_ID,
            clientSecret: process.env.BUNGIE_CLIENT_SECRET,
            httpOptions: { headers: { "X-API-Key": process.env.BUNGIE_API_KEY } }
        })
    ],
    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
        error: "/auth/error", // Error code passed in query string as ?error=
        newUser: "/welcome" // New users will be directed here on first sign in
    },
    callbacks: {
        async session({ session, user }) {
            if (
                session.token?.value &&
                session.token.expires &&
                Date.now() < session.token.expires
            ) {
                // If the access token has not expired yet
                return session
            } else if (Date.now() < user.refresh_expires_at.getTime()) {
                console.log("refreshing token")
                try {
                    const tokens = await getAccessTokenFromRefreshToken(user.refresh_token)

                    await prismaClient.user.update({
                        where: {
                            id: user.id
                        },
                        data: {
                            refresh_token: tokens.refresh.value,
                            refresh_expires_at: new Date(tokens.refresh.expires)
                        }
                    })

                    return {
                        ...session,
                        token: tokens.access
                    }
                } catch (e) {
                    console.error(e)
                    return { ...session, error: "RefreshAccessTokenError" as const }
                }
            } else {
                return { ...session, error: "ExpiredRefreshTokenError" as const }
            }
        }
    }
})
