import { AccessToken, User as PrismaUser, RefreshToken } from "@prisma/client"
import NextAuth from "next-auth/next"
import { DefaultSession } from "next-auth"
import prisma from "../../../util/server/prisma"
import DiscordProvider from "next-auth/providers/discord"
import TwitchProvider from "next-auth/providers/twitch"
import TwitterProvider from "next-auth/providers/twitter"
import { SessionUser, sessionCallback } from "../../../util/server/auth/sessionCallback"
import { Provider } from "next-auth/providers"
import CustomPrismaAdapter from "../../../util/server/auth/CustomPrismaAdapter"
import CustomBungieProvider from "../../../util/server/auth/CustomBungieProvider"
import { updateBungieAccessTokens } from "../../../util/server/auth/updateBungieAccessTokens"

type AuthError = "BungieAPIOffline" | "AccessTokenError" | "ExpiredRefreshTokenError"

declare module "next-auth" {
    interface Session extends DefaultSession {
        error?: AuthError
        user: SessionUser
    }
}

declare module "next-auth/adapters" {
    interface AdapterUser extends PrismaUser {
        name: string
        image: string
        bungieAccessToken: AccessToken | null
        bungieRefreshToken: RefreshToken | null
    }
}

export default NextAuth({
    adapter: CustomPrismaAdapter(prisma),
    providers: getProviders(),
    pages: {
        signIn: "/login",
        signOut: "/logout",
        error: "/error", // Error code passed in query string as ?error=
        newUser: "/account" // New users will be directed here on first sign in
    },
    callbacks: {
        session: sessionCallback,
        signIn({ account }) {
            if (account?.provider === "bungie") {
                updateBungieAccessTokens({
                    bungieMembershipId: account.membership_id as string,
                    access: {
                        value: account.access_token!,
                        expires: account.expires_at! * 1000
                    },
                    refresh: {
                        value: account.refresh_token!,
                        expires: Date.now() + 7776000000
                    }
                })
            }
            return true
        }
    }
})

function getProviders(): Provider[] {
    const providers = new Array<Provider>()
    if (
        process.env.BUNGIE_CLIENT_ID &&
        process.env.BUNGIE_CLIENT_SECRET &&
        process.env.BUNGIE_API_KEY
    ) {
        providers.push(
            CustomBungieProvider({
                clientId: process.env.BUNGIE_CLIENT_ID,
                clientSecret: process.env.BUNGIE_CLIENT_SECRET,
                apiKey: process.env.BUNGIE_API_KEY
            })
        )
    }

    if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
        providers.push(
            DiscordProvider({
                clientId: process.env.DISCORD_CLIENT_ID,
                clientSecret: process.env.DISCORD_CLIENT_SECRET
            })
        )
    }

    if (process.env.TWITCH_CLIENT_ID && process.env.TWITCH_CLIENT_SECRET) {
        providers.push(
            TwitchProvider({
                clientId: process.env.TWITCH_CLIENT_ID,
                clientSecret: process.env.TWITCH_CLIENT_SECRET
            })
        )
    }

    if (process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET) {
        providers.push(
            TwitterProvider({
                version: "2.0",
                clientId: process.env.TWITTER_CLIENT_ID,
                clientSecret: process.env.TWITTER_CLIENT_SECRET
            })
        )
    }

    return providers
}
