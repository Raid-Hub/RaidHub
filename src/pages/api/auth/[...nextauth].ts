import NextAuth from "next-auth"
import { DefaultSession, NextAuthOptions } from "next-auth"
import { getMembershipDataForCurrentUser } from "bungie-net-core/lib/endpoints/User"
import { GeneralUser } from "bungie-net-core/lib/models"
import { getAccessTokenFromRefreshToken } from "bungie-net-core/lib/auth"
import { BungieNetTokens } from "bungie-net-core/lib/auth/tokens"
import { OAuthConfig, OAuthProvider } from "next-auth/providers"
import { AccessTokenObject } from "bungie-net-core/lib/client"

type AuthError = "RefreshAccessTokenError" | "ExpiredRefreshTokenError"

declare module "next-auth" {
    interface Profile extends GeneralUser {}
    interface Session extends DefaultSession {
        user: {} & DefaultSession["user"] & GeneralUser
        error?: AuthError
        access_token?: string
        token_expiry: number
    }
}

declare module "next-auth/jwt" {
    interface JWT extends BungieNetTokens {
        error?: AuthError
        bungieUser?: GeneralUser
    }
}

const BungieProvider: OAuthProvider = options => {
    return {
        id: "bungie",
        name: "Bungie",
        type: "oauth",
        authorization: {
            url: "https://www.bungie.net/en/OAuth/Authorize?reauth=true",
            params: { scope: "" }
        },
        token: "https://www.bungie.net/platform/app/oauth/token/",
        // Correctly gets the current user info so that the existing `profile` definition works
        userinfo: {
            request: async ({ tokens }) => getBungieMembershipData(tokens)
        },
        profile(profile) {
            return {
                id: profile.membershipId,
                ...profile
            }
        },
        options: options as Required<Pick<OAuthConfig<any>, "clientId" | "clientSecret">>
    }
}

export const authOptions: NextAuthOptions = {
    callbacks: {
        async jwt({ token, account, profile }) {
            console.log("jwt", { token, account, profile })
            if (account && account.access_token && account.refresh_token) {
                // Save the access token and refresh token in the JWT on the initial login
                return {
                    bungieUser: profile,
                    bungieMembershipId: account.providerAccountId,
                    access: {
                        value: account.access_token,
                        type: "access",
                        created: Date.now(),
                        expires: Date.now() + 15000
                        // (account.expires_at ?? 3540) * 1000
                    },
                    refresh: {
                        value: account.refresh_token,
                        type: "refresh",
                        created: Date.now(),
                        expires: Date.now() + 7775940000
                    }
                }
            } else if (Date.now() < token.access.expires) {
                // If the access token has not expired yet, return it
                return token
            } else if (Date.now() < token.refresh.expires) {
                try {
                    return getAccessTokenFromRefreshToken(token.refresh.value)
                } catch (e) {
                    return { ...token, error: "RefreshAccessTokenError" as const }
                }
            } else {
                return { ...token, error: "ExpiredRefreshTokenError" as const }
            }
        },
        async session({ session, token }) {
            session.error = token.error
            if (token.error) {
                session.access_token = undefined
                session.token_expiry = 0
            } else {
                session.user = {
                    ...session.user,
                    ...token.bungieUser
                }
                session.access_token = token.access.value
                session.token_expiry = token.access.expires
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

async function getBungieMembershipData(protoClient: AccessTokenObject): Promise<GeneralUser> {
    return getMembershipDataForCurrentUser
        .bind(protoClient)()
        .then(res => res.Response.bungieNetUser)
}
