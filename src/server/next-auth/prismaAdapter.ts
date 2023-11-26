import { Account, PrismaClient } from "@prisma/client"
import { zUser, zUsernames } from "~/util/zod"
import { Adapter } from "@auth/core/adapters"
import { z } from "zod"

const zToken = z.object({
    value: z.string(),
    expires: z.date()
})

export const prismaAdapter = (prisma: PrismaClient): Adapter => ({
    async createUser(user) {
        const parsedUser = zUser.parse(user)
        const usernames = zUsernames.parse(user)
        const bungieAccessToken = zToken.parse(user.bungieAccessToken)
        const bungieRefreshToken = zToken.parse(user.bungieRefreshToken)

        const created = await prisma.user.create({
            data: {
                ...parsedUser,
                profile: {
                    create: usernames
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
        return { ...created, email: created.email || "" }
    },
    async getUser(id) {
        const found = await prisma.user.findUnique({
            where: {
                id
            },
            include: {
                bungieAccessToken: true,
                bungieRefreshToken: true
            }
        })
        return found ? { ...found, email: found.email || "" } : null
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

        return account?.user ? { ...account.user, email: account.user.email || "" } : null
    },
    async linkAccount(account) {
        // if (account.provider === "discord") {
        //     await addDiscordAccountToUser(account)
        // } else if (account.provider === "twitch") {
        //     await addTwitchAccountToUser(account)
        // } else if (account.provider === "twitter") {
        //     await addTwitterAccountToUser(account)
        // } else if (account.provider === "google") {
        //     await addYoutubeAccountToUser(account)
        // }

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
                session_state: account.session_state ? String(account.session_state) : null
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
        const {
            user: { email, ...user },
            ...session
        } = userAndSession
        return { user: { ...user, email: email || "" }, session }
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
        const updated = await prisma.user.update({
            where: {
                id: user.id
            },
            data: parsed,
            include: {
                profile: true,
                bungieAccessToken: true,
                bungieRefreshToken: true
            }
        })
        return { ...updated, email: updated.email || "" }
    }
})
