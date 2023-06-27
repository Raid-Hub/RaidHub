import NextAuth from "next-auth"
import { DefaultSession, NextAuthOptions } from "next-auth"
import BungieProvider from "next-auth/providers/bungie"
import { getMembershipDataForCurrentUser } from "bungie-net-core/lib/endpoints/User"
import { GeneralUser } from "bungie-net-core/lib/models"

declare module "next-auth" {
    interface Profile extends GeneralUser {}
    interface Session extends DefaultSession {
        user: {} & DefaultSession["user"] & GeneralUser
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        bungieUser: GeneralUser
    }
}
export const authOptions: NextAuthOptions = {
    callbacks: {
        async jwt({ token, profile }) {
            if (profile) {
                token.bungieUser = profile
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user = {
                    ...session.user,
                    ...token.bungieUser
                }
            }
            return session
        }
    },
    providers: [
        BungieProvider({
            clientId: process.env.BUNGIE_CLIENT_ID,
            clientSecret: process.env.BUNGIE_CLIENT_SECRET,
            // The Bungie API doesn't like scope being set
            authorization: { params: { scope: "" } },
            httpOptions: { headers: { "X-API-Key": process.env.BUNGIE_API_KEY } },
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
            }
        })
    ]
}
export default NextAuth(authOptions)
