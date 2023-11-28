import type { Prisma, PrismaClient } from "@prisma/client"
import { zProfile, zUser } from "~/util/zod"
import { Adapter } from "@auth/core/adapters"
import { z } from "zod"
import { getTwitterProfile } from "./providers/twitter"
import { getDiscordProfile } from "./providers/discord"
import { getTwitchProfile } from "./providers/twitch"
import { getYoutubeProfile } from "./providers/youtube"

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
    async linkAccount(rawAccount) {
        const account: Prisma.AccountCreateInput = {
            accessToken: rawAccount.access_token,
            expiresAt: rawAccount.expires_at,
            idToken: rawAccount.id_token,
            provider: rawAccount.provider,
            providerAccountId: rawAccount.providerAccountId,
            refreshToken: rawAccount.refresh_token,
            scope: rawAccount.scope,
            tokenType: rawAccount.token_type,
            type: rawAccount.type,
            user: {
                connect: {
                    id: rawAccount.userId
                }
            }
        }

        switch (account.provider) {
            case "bungie":
                await prisma.account.create({
                    data: account
                })
                break
            case "twitter":
                const twitterProfile = await getTwitterProfile(account.accessToken!)

                await prisma.account.create({
                    data: {
                        ...account,
                        displayName: twitterProfile.username,
                        url: twitterProfile.url
                    }
                })
                break
            case "discord":
                const discordProfile = await getDiscordProfile(account.accessToken!)
                await prisma.account.create({
                    data: {
                        ...account,
                        displayName: discordProfile.username,
                        url: `https://discord.com/users/${discordProfile.id}`
                    }
                })
                break
            case "twitch":
                const twitchProfile = await getTwitchProfile(account.accessToken!)
                await prisma.account.create({
                    data: {
                        ...account,
                        displayName: twitchProfile.display_name,
                        url: `https://twitch.tv/${twitchProfile.login}`
                    }
                })
                break
            case "google":
                const youtubeProfile = await getYoutubeProfile(account.accessToken!)
                await prisma.account.create({
                    data: {
                        ...account,
                        displayName: youtubeProfile.snippet.title,
                        url: youtubeProfile.snippet.customUrl
                            ? `https://youtube.com/${youtubeProfile.snippet.customUrl}`
                            : `https://youtube.com/channel/${youtubeProfile.id}`
                    }
                })
        }
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
