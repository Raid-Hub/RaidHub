import "server-only"

import { getServerSession, type NextAuthOptions } from "next-auth"
import { Provider } from "next-auth/providers"
import DiscordProvider from "next-auth/providers/discord"
import GoogleProvider from "next-auth/providers/google"
import TwitchProvider from "next-auth/providers/twitch"
import TwitterProvider from "next-auth/providers/twitter"
import { cache } from "react"
import { prisma } from "../prisma"
import { PrismaAdapter } from "./adapter"
import BungieProvider from "./providers/BungieProvider"
import { sessionCallback } from "./sessionCallback"
import { signInCallback } from "./signInCallback"

export const authOptions: NextAuthOptions = {
    providers: getProviders(),
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/logout",
        newUser: "/account" // New users will be directed here on first sign in
    },
    session: {
        strategy: "database",
        maxAge: 7776000 // 90 days
    },
    callbacks: {
        // @ts-expect-error
        session: sessionCallback,
        // @ts-expect-error
        signIn: signInCallback
    },
    // todo improve the logging
    logger: {
        error(code, ...message) {
            console.error(code, message)
        },
        warn(code, ...message) {
            console.warn(code, message)
        },
        debug(code, ...message) {
            console.debug(code, message)
        }
    }
}

// We cache the session for each request to avoid unnecessary database calls
export const getServerAuthSession = cache(() => getServerSession(authOptions))

function getProviders(): Provider[] {
    const providers = new Array<Provider>(
        BungieProvider({
            clientId: process.env.BUNGIE_CLIENT_ID!,
            clientSecret: process.env.BUNGIE_CLIENT_SECRET!,
            apiKey: process.env.BUNGIE_API_KEY!
        })
    )

    if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
        providers.push(
            DiscordProvider({
                clientId: process.env.DISCORD_CLIENT_ID,
                clientSecret: process.env.DISCORD_CLIENT_SECRET,
                // removes the email scope
                authorization: "https://discord.com/api/oauth2/authorize?scope=identify"
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
                name: "Twitter",
                clientId: process.env.TWITTER_CLIENT_ID,
                clientSecret: process.env.TWITTER_CLIENT_SECRET
            })
        )
    }

    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        providers.push(
            GoogleProvider({
                name: "YouTube",
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                authorization: {
                    params: {
                        scope: "openid profile https://www.googleapis.com/auth/youtube.readonly"
                    }
                }
            })
        )
    }

    return providers
}
