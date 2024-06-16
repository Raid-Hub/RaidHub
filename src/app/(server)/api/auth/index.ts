import "server-only"

import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import TwitchProvider from "next-auth/providers/twitch"
import TwitterProvider from "next-auth/providers/twitter"
import { prisma } from "~/server/prisma"
import { reactDedupe } from "~/util/react-cache"
import { PrismaAdapter } from "./adapter"
import BungieProvider from "./providers/BungieProvider"
import { sessionCallback } from "./sessionCallback"
import { signInCallback } from "./signInCallback"

const youtubeProvider = {
    id: "youtube",
    name: "YouTube",
    type: "oidc" as const,
    issuer: "https://accounts.google.com",
    options: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
            params: {
                scope: "openid https://www.googleapis.com/auth/youtube.readonly"
            }
        }
    }
}

export const {
    auth,
    handlers: { GET, POST }
} = NextAuth({
    trustHost: true,
    providers: getProviders(),
    adapter: PrismaAdapter(prisma),
    pages: {
        error: "/error",
        signIn: "/auth/login",
        signOut: "/auth/logout",
        newUser: "/account" // New users will be directed here on first sign in
    },
    session: {
        strategy: "database",
        maxAge: 7776000 // 90 days
    },
    callbacks: {
        // @ts-expect-error Types are wrong
        session: sessionCallback,
        // @ts-expect-error Types are wrong
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
            if (process.env.NODE_ENV !== "production") console.debug(code, message)
        }
    }
})

// We cache the session for each request to avoid unnecessary database calls
export const getServerSession = reactDedupe(auth)

type ProviderType =
    | ReturnType<typeof BungieProvider>
    | ReturnType<typeof DiscordProvider>
    | ReturnType<typeof TwitchProvider>
    | ReturnType<typeof TwitterProvider>
    | typeof youtubeProvider

export function getProviders(): ProviderType[] {
    const providers = new Array<ProviderType>(
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
            }) as ProviderType
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
        providers.push(youtubeProvider)
    }

    return providers
}
