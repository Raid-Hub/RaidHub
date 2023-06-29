import NextAuth, { NextAuthOptions, DefaultUser, DefaultSession, Profile, User } from "next-auth"
import { OAuthConfig, OAuthProvider } from "next-auth/providers"
import { getAccessTokenFromRefreshToken } from "bungie-net-core/lib/auth"
import { AccessTokenObject } from "bungie-net-core/lib/client"
import { BungieNetTokens, Token } from "bungie-net-core/lib/auth/tokens"
import { getMembershipDataForCurrentUser } from "bungie-net-core/lib/endpoints/User"
import { getLinkedProfiles } from "bungie-net-core/lib/endpoints/Destiny2"
import {
    BungieMembershipType,
    DestinyProfileUserInfoCard,
    GeneralUser as BungieUser
} from "bungie-net-core/lib/models"

type AuthError = "RefreshAccessTokenError" | "ExpiredRefreshTokenError"

declare module "next-auth" {
    interface Profile extends BungieUser, DestinyProfileUserInfoCard {}
    interface User extends DefaultUser {
        membershipType: BungieMembershipType
    }
    interface Session extends DefaultSession {
        user?: User
        error?: AuthError
        token?: Token
    }
}

declare module "next-auth/jwt" {
    interface JWT extends BungieNetTokens {
        error?: AuthError
        user?: User
    }
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
            // accessed from jwt ({ profile })
            request: async ({ tokens }) => getBungieMembershipData(tokens)
        },
        profile(profile: Profile) {
            // accessed from jwt ({ user })
            return {
                id: profile.membershipId,
                name: profile.displayName,
                membershipType: profile.membershipType,
                email: null,
                image: `https://www.bungie.net${
                    profile.profilePicturePath.startsWith("/") ? "" : "/"
                }${profile.profilePicturePath}`
            } as User
        },
        options: options as Required<Pick<OAuthConfig<any>, "clientId" | "clientSecret">>
    }
}

export const authOptions: NextAuthOptions = {
    callbacks: {
        async jwt({ token, account, profile, user }) {
            if (account && account.access_token && account.refresh_token) {
                // Save the access token and refresh token in the JWT on the initial login
                const now = Date.now()
                return {
                    user,
                    bungieMembershipId: account.providerAccountId,
                    access: {
                        value: account.access_token,
                        type: "access",
                        created: now,
                        expires: Math.round((account.expires_at ?? now / 1000) * 1000)
                    },
                    refresh: {
                        value: account.refresh_token,
                        type: "refresh",
                        created: now,
                        expires: now + 3600 * 24 * 90 * 1000
                    }
                }
            } else if (Date.now() + 1000 < token.access.expires) {
                // If the access token has not expired yet, return it
                return token
            } else if (Date.now() < token.refresh.expires) {
                try {
                    return {
                        ...token,
                        ...(await getAccessTokenFromRefreshToken(token.refresh.value))
                    }
                } catch (e) {
                    return { ...token, error: "RefreshAccessTokenError" as const }
                }
            } else {
                return { ...token, error: "ExpiredRefreshTokenError" as const }
            }
        },
        async session({ session, token }) {
            session.error = token.error
            session.user = token.user
            if (token.error) {
                session.token = undefined
            } else {
                session.token = token.access
            }
            return session
        }
    },
    providers: [
        BungieProvider({
            clientId: process.env.BUNGIE_CLIENT_ID,
            clientSecret: process.env.BUNGIE_CLIENT_SECRET,
            httpOptions: { headers: { "X-API-Key": process.env.BUNGIE_API_KEY } }
        })
    ]
}

export default NextAuth(authOptions)

async function getBungieMembershipData({
    access_token
}: AccessTokenObject): Promise<BungieUser & DestinyProfileUserInfoCard> {
    const protoClient = {
        access_token,
        getMembershipDataForCurrentUser,
        getLinkedProfiles
    }

    const bnetData = await protoClient
        .getMembershipDataForCurrentUser()
        .then(res => res.Response.bungieNetUser)

    const linkedProfiles = await protoClient
        .getLinkedProfiles({
            membershipId: bnetData.membershipId,
            membershipType: BungieMembershipType.BungieNext
        })
        .then(res => res.Response.profiles)
    return {
        ...bnetData,
        ...(linkedProfiles.find(profile => profile.isCrossSavePrimary) ?? linkedProfiles[0])
    }
}
