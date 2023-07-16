import { getAccessTokenFromRefreshToken } from "bungie-net-core/lib/auth"
import { getMembershipDataForCurrentUser } from "bungie-net-core/lib/endpoints/User"
import {
    BungieMembershipType,
    GeneralUser as BungieUser,
    GroupUserInfoCard
} from "bungie-net-core/lib/models"
import { OAuthConfig, OAuthProvider } from "next-auth/providers/oauth"
import BungieClient from "../../../services/bungie/client"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { User as PrismaUser, Account as PrismaAccount } from "@prisma/client"
import NextAuth from "next-auth/next"
import { DefaultSession, Profile, Session, TokenSet } from "next-auth"
import prisma from "../../../util/server/prisma"

type AuthError = "RefreshAccessTokenError" | "ExpiredRefreshTokenError"

type SessionUser = {
    id: string
    destinyMembershipId: string
    destinyMembershipType: BungieMembershipType
    name: string | null
    image: string | null
    bungieAccessToken: {
        value: string
        expires: number
    }
}

function sessionUser(user: PrismaUser): SessionUser {
    return {
        id: user.id,
        destinyMembershipId: user.destinyMembershipId,
        destinyMembershipType: user.destinyMembershipType,
        image: user.image,
        name: user.name,
        bungieAccessToken: {
            value: user.bungie_access_token,
            expires: user.bungie_access_expires_at.getTime()
        }
    }
}

declare module "next-auth" {
    interface Session extends DefaultSession {
        error?: AuthError
        user: SessionUser
    }
}

declare module "next-auth/adapters" {
    interface AdapterUser extends PrismaUser {}
}

declare module "next-auth" {
    interface Profile extends BungieUser, GroupUserInfoCard, TokenSet {}
}

const prismaAdapter = PrismaAdapter(prisma)
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
        profile(profile: Profile) {
            return {
                id: profile.membershipId,
                name: profile.bungieGlobalDisplayName ?? profile.displayName,
                destinyMembershipId: profile.membershipId,
                destinyMembershipType: profile.membershipType,
                image: `https://www.bungie.net${
                    profile.profilePicturePath.startsWith("/") ? "" : "/"
                }${profile.profilePicturePath}`,
                bungie_access_token: profile.access_token!,
                bungie_access_expires_at: new Date(Date.now() + 3_600_000),
                bungie_refresh_token: profile.refresh_token!,
                bungie_refresh_expires_at: new Date(Date.now() + 7_776_000_000),
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
            const newUser = sessionUser(user as PrismaUser)
            if (Date.now() < user.bungie_access_expires_at.getTime()) {
                // If user access token has not expired yet
                return {
                    ...session,
                    user: newUser
                } satisfies Session
            } else if (Date.now() < user.bungie_refresh_expires_at.getTime()) {
                console.log("refreshing token")
                try {
                    const tokens = await getAccessTokenFromRefreshToken(user.bungie_refresh_token)

                    const updatedUser = await prisma.user.update({
                        where: {
                            id: user.id
                        },
                        data: {
                            bungie_access_token: tokens.access.value,
                            bungie_access_expires_at: new Date(tokens.access.expires),
                            bungie_refresh_token: tokens.refresh.value,
                            bungie_refresh_expires_at: new Date(tokens.refresh.expires)
                        }
                    })

                    return {
                        ...session,
                        user: {
                            ...sessionUser(updatedUser),
                            bungieAccessToken: {
                                value: tokens.access.value,
                                expires: tokens.access.expires
                            }
                        }
                    } satisfies Session
                } catch (e) {
                    console.error(e)
                    return {
                        ...session,
                        user: newUser,
                        error: "RefreshAccessTokenError" as const
                    } satisfies Session
                }
            } else {
                return {
                    ...session,
                    user: newUser,
                    error: "ExpiredRefreshTokenError" as const
                } satisfies Session
            }
        }
    }
})
