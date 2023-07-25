import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { User as PrismaUser, Account as PrismaAccount } from "@prisma/client"
import NextAuth from "next-auth/next"
import { DefaultSession } from "next-auth"
import prisma from "../../../util/server/prisma"
import { CustomBungieProvider, parseMembershipsResponse } from "../../../util/server/auth/bungie"
import DiscordProvider from "next-auth/providers/discord"
import TwitchProvider from "next-auth/providers/twitch"
import TwitterProvider from "next-auth/providers/twitter"
import { discordProfile } from "../../../util/server/auth/discordProfile"
import { SessionUser, sessionCallback } from "../../../util/server/auth/sessionCallback"
import { twitchProfile } from "../../../util/server/auth/twitchProfile"
import { twitterProfile } from "../../../util/server/auth/twitterProfile"
import { Provider } from "next-auth/providers"
import { getMembershipDataForCurrentUser } from "bungie-net-core/lib/endpoints/User"
import BungieClient from "../../../services/bungie/client"
import { BungieMembershipType } from "bungie-net-core/lib/models"

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
prismaAdapter.linkAccount = async data => {
    let updatePromise
    if (data.provider === "bungie") {
        const user = await prisma.user.findFirst({
            where: {
                id: data.userId
            },
            select: {
                destinyMembershipId: true,
                destinyMembershipType: true
            }
        })
        let destinyMembership:
            | {
                  destinyMembershipId: string
                  destinyMembershipType: BungieMembershipType
              }
            | {} = {}
        if (!user?.destinyMembershipId || !user.destinyMembershipType) {
            const client = new BungieClient()
            client.setToken(data.access_token!)
            const profile = await getMembershipDataForCurrentUser(client).then(
                parseMembershipsResponse
            )
            destinyMembership = {
                destinyMembershipId: profile.destinyMembershipId!,
                destinyMembershipType: profile.destinyMembershipType!
            }
        }

        updatePromise = prisma.user.update({
            where: {
                id: data.userId
            },
            data: {
                ...destinyMembership,
                bungie_access_token: data.access_token!,
                bungie_access_expires_at: new Date(Date.now() + 3_599_000),
                bungie_refresh_token: data.refresh_token!,
                bungie_refresh_expires_at: new Date(Date.now() + 7_775_999_000)
            }
        })
    }
    // cleans properties that shouldnt be here
    await prisma.account.create({
        data: {
            userId: data.userId,
            type: data.type,
            provider: data.provider,
            providerAccountId: data.providerAccountId,
            refresh_token: data.refresh_token ?? null,
            access_token: data.access_token ?? null,
            expires_at: data.expires_at ?? null,
            token_type: data.token_type ?? null,
            scope: data.scope ?? null,
            id_token: data.id_token ?? null,
            session_state: data.session_state ?? null
        } satisfies Omit<PrismaAccount, "id">
    })
    await updatePromise
}

export default NextAuth({
    adapter: prismaAdapter,
    providers: getProviders(),
    pages: {
        signIn: "/login",
        signOut: "/logout",
        error: "/auth/error", // Error code passed in query string as ?error=
        newUser: "/account" // New users will be directed here on first sign in
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
