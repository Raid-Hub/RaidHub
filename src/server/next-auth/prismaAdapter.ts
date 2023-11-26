import type { PrismaClient } from "@prisma/client"
import { zProfile, zUser } from "~/util/zod"
import { Adapter } from "@auth/core/adapters"
import { z } from "zod"

const zToken = z.object({
    value: z.string(),
    expires: z.date()
})

export const prismaAdapter = (prisma: PrismaClient): Adapter => ({
    async createUser(user) {
        const parsedUser = zUser.parse(user)
        const parsedProfile = zProfile.parse(user)
        const bungieAccessToken = zToken.parse(user.bungieAccessToken)
        const bungieRefreshToken = zToken.parse(user.bungieRefreshToken)

        const { profile, ...created } = await prisma.user.create({
            data: {
                ...parsedUser,
                profile: {
                    create: parsedProfile
                },
                bungieAccessToken: {
                    create: bungieAccessToken
                },
                bungieRefreshToken: {
                    create: bungieRefreshToken
                }
            },
            include: {
                bungieAccessToken: true,
                bungieRefreshToken: true,
                profile: {
                    select: {
                        name: true,
                        image: true,
                        destinyMembershipId: true,
                        destinyMembershipType: true
                    }
                }
            }
        })
        if (!profile) throw new Error("Profile not created")
        return { ...created, ...profile, email: created.email || "" }
    },
    async updateUser(user) {
        const parsed = zUser.parse(user)
        const { profile, ...updated } = await prisma.user.update({
            where: {
                id: user.id
            },
            data: parsed,
            include: {
                profile: {
                    select: {
                        name: true,
                        image: true,
                        destinyMembershipId: true,
                        destinyMembershipType: true
                    }
                },
                bungieAccessToken: true,
                bungieRefreshToken: true
            }
        })
        if (!profile) throw new Error("Profile not updated")

        return { ...updated, ...profile, email: updated.email || "" }
    },
    async getUser(id) {
        const found = await prisma.user.findUnique({
            where: {
                id
            },
            include: {
                profile: {
                    select: {
                        name: true,
                        image: true,
                        destinyMembershipId: true,
                        destinyMembershipType: true
                    }
                },
                bungieAccessToken: true,
                bungieRefreshToken: true
            }
        })
        if (!found) return null
        const { profile, ...user } = found
        if (!profile) throw new Error("Profile not found")
        return { ...user, ...profile, email: found.email || "" }
    },
    async getUserByAccount(provider_providerAccountId) {
        const account = await prisma.account.findUnique({
            where: { provider_providerAccountId },
            select: {
                user: {
                    include: {
                        profile: {
                            select: {
                                name: true,
                                image: true,
                                destinyMembershipId: true,
                                destinyMembershipType: true
                            }
                        },
                        bungieAccessToken: true,
                        bungieRefreshToken: true
                    }
                }
            }
        })
        if (!account) return null
        const { profile, ...user } = account.user
        if (!profile) throw new Error("Profile not found")
        return { ...user, ...profile, email: user.email || "" }
    },
    async getUserByEmail() {
        return null
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
                displayName: null,
                refreshToken: account.refresh_token ?? null,
                accessToken: account.access_token ?? null,
                expiresAt: account.expires_at ?? null,
                tokenType: account.token_type ?? null,
                scope: account.scope ?? null,
                idToken: account.id_token ?? null,
                sessionState: account.session_state ? String(account.session_state) : null
            }
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
                        profile: {
                            select: {
                                name: true,
                                image: true,
                                destinyMembershipId: true,
                                destinyMembershipType: true
                            }
                        },
                        bungieAccessToken: true,
                        bungieRefreshToken: true
                    }
                }
            }
        })
        if (!userAndSession) return null
        const {
            user: { profile, ...restOfUser },
            ...session
        } = userAndSession
        if (!profile) throw new Error("Profile not found")
        return { user: { ...profile, ...restOfUser, email: restOfUser.email || "" }, session }
    },
    async updateSession(session) {
        return prisma.session.update({
            where: { sessionToken: session.sessionToken },
            data: session
        })
    },
    async deleteSession(sessionToken) {
        return prisma.session.delete({ where: { sessionToken } })
    }
})
