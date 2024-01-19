import DiscordProvider from "@auth/core/providers/discord"
import TwitchProvider from "@auth/core/providers/twitch"
import TwitterProvider from "@auth/core/providers/twitter"
import GoogleProvider from "@auth/core/providers/google"
import BungieProvider from "~/server/next-auth/providers/BungieProvider"
import { sessionCallback } from "~/server/next-auth/sessionCallback"
import { signInCallback } from "./signInCallback"
import { prismaAdapter } from "./adapter"
import prisma from "../prisma"
import { Provider } from "@auth/core/providers"
import NextAuth from "next-auth"
import { User as PrismaUser } from "@prisma/client"
import { BungieMembershipType } from "bungie-net-core/models"
import { ServerResponse } from "http"
import { AdapterUser } from "@auth/core/adapters"

declare module "@auth/core/types" {
    interface Session {
        error?: AuthError
        user: AdapterUser
        bungieAccessToken?: {
            value: string
            expires: Date
        }
        expires: Date
    }
}

declare module "@auth/core/adapters" {
    interface AdapterUser extends PrismaUser {
        image: string
        name: string
        destinyMembershipId: string
        destinyMembershipType: BungieMembershipType
    }
}

export type BungieToken = {
    value: string
    expires: Date
}

export type BungieAccount = {
    refreshToken: string | null
    accessToken: string | null
    expiresAt: number | null
    refreshExpiresAt: number | null
}

export type AuthError = "BungieAPIOffline" | "AccessTokenError" | "ExpiredRefreshTokenError"

// stupid fuckery to get around a next auth issue, i hate it
export const auth: typeof _auth = (...args) => {
    // @ts-expect-error
    if ("res" in args[0]) {
        const { res, ...restOfArgs } = args[0]
        const fakeRes = new Response()
        // @ts-expect-error
        const result = _auth({ ...restOfArgs, res: fakeRes })
        fakeRes.headers.forEach((value, key) => {
            // @ts-expect-error
            args[1].setHeader(key, value)
        })
        return result
    } else if (args[1] instanceof ServerResponse) {
        const fakeRes = new Response()
        // @ts-expect-error
        const result = _auth(args[0], fakeRes)
        fakeRes.headers.forEach((value, key) => {
            // @ts-expect-error
            args[1].setHeader(key, value)
        })
        return result
    }
    // @ts-expect-error
    else return _auth(args)
}

export { GET, POST }

const {
    auth: _auth,
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
        // @ts-expect-error
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
