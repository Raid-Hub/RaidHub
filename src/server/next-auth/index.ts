import DiscordProvider from "@auth/core/providers/discord"
import TwitchProvider from "@auth/core/providers/twitch"
import TwitterProvider from "@auth/core/providers/twitter"
import GoogleProvider from "@auth/core/providers/google"
import BungieProvider from "~/server/next-auth/providers/BungieProvider"
import { SessionUser, sessionCallback } from "~/server/next-auth/sessionCallback"
import { signInCallback } from "./signInCallback"
import { prismaAdapter } from "./prismaAdapter"
import prisma from "../prisma"
import { Provider } from "@auth/core/providers"
import NextAuth from "next-auth"
import { User as PrismaUser, Session as PrismaSession } from "@prisma/client"

export type BungieToken = {
    value: string
    expires: Date
}

export type AuthError = "BungieAPIOffline" | "AccessTokenError" | "ExpiredRefreshTokenError"

declare module "@auth/core/types" {
    interface Session extends PrismaSession {
        error?: AuthError
        user: SessionUser
    }
}

declare module "@auth/core/adapters" {
    interface AdapterUser extends PrismaUser {
        image: string
        name: string
        bungieAccessToken: BungieToken | null
        bungieRefreshToken: BungieToken | null
    }
}

// next auth(or should i say auth.js???) needs to get their shit together with these types man
export const {
    auth,
    handlers: { GET, POST }
} = NextAuth({
    providers: getProviders(),
    adapter: prismaAdapter(prisma),
    pages: {
        signIn: "/login",
        signOut: "/logout",
        error: "/error", // Error code passed in query string as ?error=
        newUser: "/account" // New users will be directed here on first sign in
    },
    session: {
        strategy: "database",
        maxAge: 7776000 // 90 days
    },
    callbacks: {
        session: sessionCallback,
        // @ts-expect-error
        signIn: signInCallback
    }
})

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
