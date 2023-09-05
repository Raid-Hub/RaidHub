import { Adapter, AdapterAccount } from "next-auth/adapters"
import { Account, PrismaClient } from "@prisma/client"
import { zUser } from "../zod"
import { DiscordProfile } from "next-auth/providers/discord"
import prisma from "../../../server/prisma"
import { TwitterProfile } from "next-auth/providers/twitter"
import { z } from "zod"

export default function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
    return {
        async createUser(user) {
            const parsedUser = zUser.parse(user)
            const [bungieAccessToken, bungieRefreshToken] = z
                .array(
                    z.object({
                        value: z.string(),
                        expires: z.date()
                    })
                )
                .parse([user.bungieAccessToken, user.bungieRefreshToken])

            return prisma.user.create({
                data: {
                    ...parsedUser,
                    profile: {
                        create: {}
                    },
                    bungieAccessToken: {
                        create: bungieAccessToken
                    },
                    bungieRefreshToken: { create: bungieRefreshToken }
                },
                include: {
                    bungieAccessToken: true,
                    bungieRefreshToken: true
                }
            })
        },
        async getUser(id) {
            return prisma.user.findUnique({
                where: {
                    id
                },
                include: {
                    bungieAccessToken: true,
                    bungieRefreshToken: true
                }
            })
        },
        async getUserByAccount(provider_providerAccountId) {
            const account = await prisma.account.findUnique({
                where: { provider_providerAccountId },
                include: {
                    user: {
                        include: {
                            bungieAccessToken: true,
                            bungieRefreshToken: true
                        }
                    }
                }
            })

            return account?.user ?? null
        },
        async linkAccount(account) {
            if (account.provider === "discord") {
                await addDiscordAccountToUser(account)
            } else if (account.provider === "twitch") {
                await addTwitchAccountToUser(account)
            } else if (account.provider === "twitter") {
                await addTwitterAccountToUser(account)
            }

            // cleans properties that shouldnt be here
            await prisma.account.create({
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
        },
        async createSession(session) {
            return prisma.session.create({ data: session })
        },
        async getSessionAndUser(sessionToken: string) {
            const userAndSession = await prisma.session.findUnique({
                where: { sessionToken },
                include: {
                    user: {
                        include: {
                            bungieAccessToken: true,
                            bungieRefreshToken: true
                        }
                    }
                }
            })
            if (!userAndSession) return null
            const { user, ...session } = userAndSession
            return { user, session }
        },
        async updateSession(session) {
            return prisma.session.update({
                where: { sessionToken: session.sessionToken },
                data: session
            })
        },
        async deleteSession(sessionToken) {
            return prisma.session.delete({ where: { sessionToken } })
        },
        async updateUser(user) {
            const parsed = zUser.parse(user)
            return prisma.user.update({
                where: {
                    id: user.id
                },
                data: parsed,
                include: {
                    bungieAccessToken: true,
                    bungieRefreshToken: true
                }
            })
        }
    }
}

async function addDiscordAccountToUser(account: AdapterAccount) {
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

    return prisma.user.update({
        where: { id: account.userId },
        data: { discordUsername: profile.username }
    })
}

async function addTwitchAccountToUser(account: AdapterAccount) {
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
    return prisma.user.update({
        where: { id: account.userId },
        data: { twitchUsername: profile.display_name }
    })
}

async function addTwitterAccountToUser(account: AdapterAccount) {
    const profile = await fetch("https://api.twitter.com/2/users/me", {
        headers: {
            Authorization: `Bearer ${account.access_token}`
        }
    }).then(async res => {
        const data = await res.json()
        if (res.ok) {
            return (data as TwitterProfile).data
        } else {
            throw data
        }
    })

    return prisma.user.update({
        where: { id: account.userId },
        data: { twitterUsername: profile.username }
    })
}
