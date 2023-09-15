import CustomBungieProvider from "~/server/next-auth/CustomBungieProvider"
import CustomPrismaAdapter from "~/server/next-auth/CustomPrismaAdapter"
import { sessionCallback } from "~/server/next-auth/sessionCallback"
import { updateBungieAccessTokens } from "~/server/next-auth/updateBungieAccessTokens"
import prisma from "server/prisma"
import { AuthOptions } from "next-auth"
import { Provider } from "next-auth/providers"
import DiscordProvider from "next-auth/providers/discord"
import TwitchProvider from "next-auth/providers/twitch"
import TwitterProvider from "next-auth/providers/twitter"

export const nextAuthOptions: AuthOptions = {
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
        async signIn({ account, user }) {
            // @ts-expect-error this line here determines if we need to update the tokens
            if (account?.provider === "bungie" && user.id !== user.bungieMembershipId) {
                await updateBungieAccessTokens({
                    bungieMembershipId: account.membership_id as string,
                    access: {
                        value: account.access_token!,
                        expires: account.expires_at! * 1000
                    },
                    refresh: {
                        value: account.refresh_token!,
                        expires: Date.now() + 7_775_777_777
                    }
                })
            }
            return true
        }
    }
}

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
