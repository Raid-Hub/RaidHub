import NextAuth, { Profile } from "next-auth"
import { DefaultSession, NextAuthOptions } from "next-auth"
import { getMembershipDataForCurrentUser } from "bungie-net-core/lib/endpoints/User"
import { GeneralUser } from "bungie-net-core/lib/models"
import { getAccessTokenFromRefreshToken } from "bungie-net-core/lib/auth"
import { BungieNetTokens } from "bungie-net-core/lib/auth/tokens"
import { OAuthConfig, OAuthProvider } from "next-auth/providers"

type AuthError = "RefreshAccessTokenError" | "ExpiredRefreshTokenError"

declare module "next-auth" {
    interface Profile extends GeneralUser {}
    interface Session extends DefaultSession {
        user: {} & DefaultSession["user"] & GeneralUser
        error?: AuthError
        token?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT extends BungieNetTokens {
        error?: AuthError
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
            request: async ({ tokens, provider }) => {
                const client = {
                    ...tokens,
                    getMembershipDataForCurrentUser
                }

                return await client
                    .getMembershipDataForCurrentUser()
                    .then(res => res.Response.bungieNetUser)
            }
        },
        profile(profile) {
            return {
                id: profile.membershipId,
                name: profile.displayName,
                email: null,
                image: `https://www.bungie.net${
                    profile.profilePicturePath.startsWith("/") ? "" : "/"
                }${profile.profilePicturePath}`
            }
        },
        options: options as Required<Pick<OAuthConfig<any>, "clientId" | "clientSecret">>
    }
}

export const authOptions: NextAuthOptions = {
    callbacks: {
        async jwt({ token, account }) {
            if (account && account.access_token && account.refresh_token) {
                // Save the access token and refresh token in the JWT on the initial login
                return {
                    ...token,
                    bungieMembershipId: account.providerAccountId,
                    access: {
                        value: account.access_token,
                        type: "access",
                        created: Date.now(),
                        expires: Date.now() + (account.expires_at ?? 3540) * 1000
                    },
                    refresh: {
                        value: account.refresh_token,
                        type: "refresh",
                        created: Date.now(),
                        expires: Date.now() + 7775940
                    }
                }
            } else if (Date.now() < token.access.expires) {
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
            if (token.error) {
                session.token = undefined
            } else {
                session.token = token.access.value
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
