import { User as PrismaUser } from "@prisma/client"
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
import { signInCallback } from "../../../util/server/auth/signInCallback"

type AuthError = "BungieAPIOffline" | "AccessTokenError" | "ExpiredRefreshTokenError"

declare module "next-auth" {
    interface Session extends DefaultSession {
        error?: AuthError
        user: SessionUser
    }
}

declare module "next-auth/adapters" {
    interface AdapterUser extends PrismaUser {}
}

export default NextAuth({
    adapter: new CustomPrismaAdapter(prisma),
    providers: getProviders(),
    pages: {
        signIn: "/login",
        signOut: "/logout",
        error: "/error", // Error code passed in query string as ?error=
        newUser: "/account" // New users will be directed here on first sign in
    },
    callbacks: {
        session: sessionCallback,
        signIn: signInCallback
    }
})

function getProviders(): Provider[] {
    const providers = new Array<Provider>()
    if (process.env.BUNGIE_CLIENT_ID && process.env.BUNGIE_CLIENT_SECRET) {
        providers.push(
            CustomBungieProvider({
                clientId: process.env.BUNGIE_CLIENT_ID,
                clientSecret: process.env.BUNGIE_CLIENT_SECRET
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
