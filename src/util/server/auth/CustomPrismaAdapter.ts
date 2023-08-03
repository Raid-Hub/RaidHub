import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { AdapterAccount, AdapterSession, AdapterUser, DefaultAdapter } from "next-auth/adapters"
import { Awaitable } from "next-auth"
import { Account, PrismaClient } from "@prisma/client"
import BungieClient from "../../../services/bungie/client"
import { getMembershipDataForCurrentUser } from "bungie-net-core/lib/endpoints/User"
import { bungieProfile } from "./bungieProfile"
import { DiscordProfile } from "next-auth/providers/discord"
import { TwitterProfile } from "next-auth/providers/twitter"

export default class CustomPrismaAdapter implements DefaultAdapter {
    private prisma: PrismaClient

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient
        // this are all the methods that aren't overriden
        const {
            getUser,
            getUserByEmail,
            getUserByAccount,
            updateUser,
            deleteUser,
            unlinkAccount,
            createSession,
            getSessionAndUser,
            updateSession,
            deleteSession
        } = PrismaAdapter(this.prisma)

        this.getUser = getUser
        this.getUserByEmail = getUserByEmail
        this.getUserByAccount = getUserByAccount
        this.updateUser = updateUser
        this.deleteUser = deleteUser
        this.unlinkAccount = unlinkAccount
        this.createSession = createSession
        this.getSessionAndUser = getSessionAndUser
        this.updateSession = updateSession
        this.deleteSession = deleteSession
    }

    createUser = async (user: Omit<AdapterUser, "id">): Promise<AdapterUser> => {
        // @ts-expect-error
        delete user.emailVerified
        // @ts-expect-error
        return this.prisma.user.create({ data: user })
    }

    linkAccount = async (account: AdapterAccount): Promise<void> => {
        if (account.provider === "bungie") {
            await this.addBungieAccountToUser(account)
        } else if (account.provider === "discord") {
            await this.addDiscordAccountToUser(account)
        } else if (account.provider === "twitch") {
            await this.addTwitchAccountToUser(account)
        } else if (account.provider === "twitter") {
            await this.addTwitterAccountToUser(account)
            null // todo
        }

        // cleans properties that shouldnt be here
        await this.prisma.account.create({
            data: {
                userId: account.userId,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token ?? null,
                access_token: account.access_token ?? null,
                expires_at: account.expires_at ?? null,
                token_type: account.token_type ?? null,
                scope: account.scope ?? null,
                id_token: account.id_token ?? null,
                session_state: account.session_state ?? null
            } satisfies Omit<Account, "id">
        })
    }
    getUser: (id: string) => Awaitable<AdapterUser | null>
    getUserByEmail: (email: string) => Awaitable<AdapterUser | null>
    getUserByAccount: (
        providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">
    ) => Awaitable<AdapterUser | null>
    updateUser: (user: Partial<AdapterUser> & Pick<AdapterUser, "id">) => Awaitable<AdapterUser>
    deleteUser?:
        | ((userId: string) => Promise<void> | Awaitable<AdapterUser | null | undefined>)
        | undefined

    unlinkAccount?:
        | ((
              providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">
          ) => Promise<void> | Awaitable<AdapterAccount | undefined>)
        | undefined
    createSession: (session: {
        sessionToken: string
        userId: string
        expires: Date
    }) => Awaitable<AdapterSession>
    getSessionAndUser: (
        sessionToken: string
    ) => Awaitable<{ session: AdapterSession; user: AdapterUser } | null>
    updateSession: (
        session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ) => Awaitable<AdapterSession | null | undefined>
    deleteSession: (
        sessionToken: string
    ) => Promise<void> | Awaitable<AdapterSession | null | undefined>

    private async addBungieAccountToUser(account: AdapterAccount) {
        const client = new BungieClient()
        client.setToken(account.access_token!)

        const profile = await getMembershipDataForCurrentUser(client).then(bungieProfile)

        return this.prisma.user.update({
            where: {
                id: account.userId
            },
            data: {
                destiny_membership_id: profile.destiny_membership_id!,
                destiny_membership_type: profile.destiny_membership_type!,
                bungie_username: profile.bungie_username ?? null,
                bungie_access_token: account.access_token,
                bungie_access_expires_at: new Date(account.expires_at!),
                bungie_refresh_token: account.refresh_token,
                bungie_refresh_expires_at: new Date(Date.now() + 7_775_777_777)
            }
        })
    }

    private async addDiscordAccountToUser(account: AdapterAccount) {
        const profile = await fetch("https://discord.com/api/users/@me", {
            headers: {
                Authorization: `Bearer ${account.access_token}`
            }
        }).then(async res => {
            const data = await res.json()
            if (res.ok) {
                return data as DiscordProfile
            } else {
                throw data
            }
        })

        return this.prisma.user.update({
            where: {
                id: account.userId
            },
            data: {
                discord_username: profile.username
            }
        })
    }

    private async addTwitchAccountToUser(account: AdapterAccount) {
        const profile = await fetch("https://api.twitch.tv/helix/users", {
            headers: {
                "Client-ID": process.env.TWITCH_CLIENT_ID!,
                Authorization: `Bearer ${account.access_token}`
            }
        }).then(async res => {
            const { data } = await res.json()
            if (res.ok) {
                return data[0] as {
                    display_name: string
                }
            } else {
                throw data
            }
        })

        return this.prisma.user.update({
            where: {
                id: account.userId
            },
            data: {
                twitch_username: profile.display_name
            }
        })
    }

    private async addTwitterAccountToUser(account: AdapterAccount) {
        const profile = await fetch("https://api.twitter.com/2/users/me", {
            headers: {
                Authorization: `Bearer ${account.access_token}`
            }
        })
            .then(async res => {
                const data = await res.json()
                if (res.ok) {
                    return data as TwitterProfile
                } else {
                    throw data
                }
            })
            .then(twitterProfile => twitterProfile.data)

        return this.prisma.user.update({
            where: {
                id: account.userId
            },
            data: {
                twitter_username: profile.username
            }
        })
    }
}
