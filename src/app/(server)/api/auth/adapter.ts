import "server-only"

import type { Prisma, PrismaClient } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { type UserMembershipData } from "bungie-net-core/models"
import { type Adapter } from "next-auth/adapters"
import { getDiscordProfile } from "./providers/discord"
import { getTwitchProfile } from "./providers/twitch"
import { getTwitterProfile } from "./providers/twitter"
import { getYoutubeProfile } from "./providers/youtube"
import { type SessionAndUserData } from "./types"

export const PrismaAdapter = (prisma: PrismaClient): Adapter => ({
    async createUser(input) {
        const data = input as unknown as UserMembershipData

        const user = await prisma.user.create({
            data: {
                id: data.bungieNetUser.membershipId,
                role: "USER"
            }
        })

        const primaryDestinyMembershipId =
            data.primaryMembershipId ?? data.destinyMemberships[0].membershipId
        const profiles = await Promise.all(
            data.destinyMemberships.map(membership =>
                prisma.profile.upsert({
                    create: {
                        destinyMembershipId: membership.membershipId,
                        destinyMembershipType: membership.membershipType,
                        isPrimary: membership.membershipId === primaryDestinyMembershipId,
                        bungieMembershipId: data.bungieNetUser.membershipId,
                        name: membership.bungieGlobalDisplayName || membership.displayName,
                        image: `https://www.bungie.net${
                            data.bungieNetUser.profilePicturePath.startsWith("/") ? "" : "/"
                        }${data.bungieNetUser.profilePicturePath}`
                    },
                    update: {
                        bungieMembershipId: data.bungieNetUser.membershipId,
                        isPrimary: membership.membershipId === primaryDestinyMembershipId
                    },
                    where: {
                        destinyMembershipId: membership.membershipId
                    },
                    select: {
                        name: true,
                        image: true,
                        isPrimary: true,
                        destinyMembershipId: true,
                        destinyMembershipType: true,
                        vanity: true
                    }
                })
            )
        )

        return {
            name: undefined,
            image: undefined,
            ...user,
            profiles,
            email: user.email ?? ""
        }
    },
    async updateUser({ profiles: _, ...data }) {
        const updated = await prisma.user.update({
            where: {
                id: data.id
            },
            data: data,
            include: {
                profiles: {
                    select: {
                        name: true,
                        image: true,
                        isPrimary: true,
                        destinyMembershipId: true,
                        destinyMembershipType: true,
                        vanity: true
                    }
                }
            }
        })

        return {
            name: undefined,
            image: undefined,
            ...updated,
            email: updated.email ?? ""
        }
    },
    async getUser(id) {
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            include: {
                profiles: {
                    select: {
                        name: true,
                        image: true,
                        isPrimary: true,
                        destinyMembershipId: true,
                        destinyMembershipType: true,
                        vanity: true
                    }
                }
            }
        })
        if (!user) return null

        return {
            name: undefined,
            image: undefined,
            ...user,
            email: user.email ?? ""
        }
    },
    async getUserByAccount(uniqueProviderAccountId) {
        const account = await prisma.account.findUnique({
            where: { uniqueProviderAccountId },
            select: {
                user: {
                    include: {
                        profiles: {
                            select: {
                                name: true,
                                image: true,
                                isPrimary: true,
                                destinyMembershipId: true,
                                destinyMembershipType: true,
                                vanity: true
                            }
                        }
                    }
                }
            }
        })
        if (!account) return null

        return {
            name: undefined,
            image: undefined,
            ...account.user,
            email: account.user.email ?? ""
        }
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
                    data: {
                        ...account,
                        refreshExpiresAt: Math.floor(Date.now() / 1000) + 7_775_777
                    }
                })
                break
            case "twitter":
                const twitterProfile = await getTwitterProfile(account.accessToken!)

                await prisma.account.create({
                    data: {
                        ...account,
                        displayName: twitterProfile.username,
                        url: `https://twitter.com/${twitterProfile.username}`
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
            case "youtube":
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
            select: {
                id: true,
                userId: true,
                expires: true,
                sessionToken: true,
                user: {
                    include: {
                        raidHubAccessToken: {
                            select: {
                                expiresAt: true,
                                value: true
                            }
                        },
                        profiles: {
                            select: {
                                name: true,
                                image: true,
                                isPrimary: true,
                                destinyMembershipId: true,
                                destinyMembershipType: true,
                                vanity: true
                            }
                        },
                        accounts: {
                            where: {
                                provider: "bungie"
                            },
                            select: {
                                accessToken: true,
                                refreshToken: true,
                                expiresAt: true,
                                refreshExpiresAt: true
                            }
                        }
                    }
                }
            }
        })
        if (!userAndSession) return null
        const {
            user: { accounts, raidHubAccessToken, ...restOfUser },
            ...session
        } = userAndSession

        const bungieAccount = accounts[0]

        if (!bungieAccount) throw new Error("Bungie account not found")

        return {
            user: {
                name: undefined,
                image: undefined,
                ...restOfUser,
                email: restOfUser.email ?? "",
                bungieAccount: bungieAccount,
                raidHubAccessToken: raidHubAccessToken
            },
            session
        } satisfies SessionAndUserData
    },
    async updateSession(session) {
        return prisma.session.update({
            where: { sessionToken: session.sessionToken },
            data: session
        })
    },
    async deleteSession(sessionToken) {
        try {
            await prisma.session.deleteMany({ where: { sessionToken } })
        } catch (e) {
            // sometimes the session is already deleted, so we don't care
            if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") return
            else throw e
        }
    }
})
