import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { User as PrismaUser, Account as PrismaAccount } from "@prisma/client"
import NextAuth from "next-auth/next"
import { DefaultSession } from "next-auth"
import prisma from "../../../util/server/prisma"
import { CustomBungieProvider } from "../../../util/server/auth/bungie"
import DiscordProvider from "next-auth/providers/discord"
import TwitchProvider from "next-auth/providers/twitch"
import TwitterProvider from "next-auth/providers/twitter"
import { discordProfile } from "../../../util/server/auth/discordProfile"
import { SessionUser, sessionCallback } from "../../../util/server/auth/sessionCallback"
import { twitchProfile } from "../../../util/server/auth/twitchProfile"
import { twitterProfile } from "../../../util/server/auth/twitterProfile"
import { Provider } from "next-auth/providers"

type AuthError = "RefreshAccessTokenError" | "ExpiredRefreshTokenError"

declare module "next-auth" {
    interface Session extends DefaultSession {
        error?: AuthError
        user: SessionUser
    }
}

declare module "next-auth/adapters" {
    interface AdapterUser extends PrismaUser {}
}

const prismaAdapter = PrismaAdapter(prisma)
const _link = prismaAdapter.linkAccount
prismaAdapter.linkAccount = data => {
    // cleans properties that shouldnt be here
    return _link({
        userId: data.userId,
        type: data.type,
        provider: data.provider,
        providerAccountId: data.providerAccountId,
        refresh_token: data.refresh_token!,
        access_token: data.access_token!,
        expires_at: data.expires_at!,
        token_type: data.token_type!,
        scope: data.scope!,
        id_token: data.id_token!,
        session_state: data.session_state!
    } satisfies Omit<PrismaAccount, "id">)
}

export default NextAuth({
    adapter: prismaAdapter,
    providers: getProviders(),
    pages: {
        signIn: "/login",
        signOut: "/logout",
        error: "/auth/error", // Error code passed in query string as ?error=
        newUser: "/welcome" // New users will be directed here on first sign in
    },
    callbacks: {
        session: sessionCallback
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
                clientSecret: process.env.DISCORD_CLIENT_SECRET,
                profile: discordProfile
            })
        )
    }

    if (process.env.TWITCH_CLIENT_ID && process.env.TWITCH_CLIENT_SECRET) {
        providers.push(
            TwitchProvider({
                clientId: process.env.TWITCH_CLIENT_ID,
                clientSecret: process.env.TWITCH_CLIENT_SECRET,
                profile: twitchProfile
            })
        )
    }

    if (process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET) {
        providers.push(
            TwitterProvider({
                version: "2.0",
                clientId: process.env.TWITTER_CLIENT_ID,
                clientSecret: process.env.TWITTER_CLIENT_SECRET,
                profile: twitterProfile
            })
        )
    }

    return providers
}
