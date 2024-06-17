import "server-only"

import { type Adapter } from "@auth/core/adapters"
import type { Prisma } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { type PrismaClientWithExtensions } from "~/server/prisma"
import { getDiscordProfile } from "./providers/discord"
import { getTwitchProfile } from "./providers/twitch"
import { getTwitterProfile } from "./providers/twitter"
import { getYoutubeProfile } from "./providers/youtube"
import { updateDestinyProfiles } from "./updateDestinyProfiles"

export const PrismaAdapter = (prisma: PrismaClientWithExtensions): Adapter => ({
    async createUser(input) {
        if (!("userMembershipData" in input)) {
            throw new Error("Bungie profile is required")
        }

        const user = await prisma.user.create({
            data: {
                id: input.id!,
                name: input.name,
                image: input.image,
                role_: input.role
            }
        })

        await updateDestinyProfiles(input.userMembershipData)

        return {
            ...user,
            email: user.email ?? "",
            profiles: [],
            bungieAccount: {
                refreshToken: null,
                accessToken: null,
                expiresAt: null,
                refreshExpiresAt: null
            },
            raidHubAccessToken: null
        }
    },
    async updateUser({ profiles: _, raidHubAccessToken: __, bungieAccount: ___, ...data }) {
        const updated = await prisma.user.update({
            where: {
                id: data.id
            },
            data: data,
            include: {
                profiles: {
                    select: {
                        isPrimary: true,
                        destinyMembershipId: true,
                        destinyMembershipType: true,
                        vanity: true
                    }
                },
                raidHubAccessToken: {
                    select: {
                        expiresAt: true,
                        value: true
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
        })

        const bungieAccount = updated.accounts[0]
        if (!bungieAccount) throw new Error("Bungie account not found")

        return {
            ...updated,
            email: updated.email ?? "",
            raidHubAccessToken: updated.raidHubAccessToken,
            bungieAccount
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
                        isPrimary: true,
                        destinyMembershipId: true,
                        destinyMembershipType: true,
                        vanity: true
                    }
                },
                raidHubAccessToken: {
                    select: {
                        expiresAt: true,
                        value: true
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
        })
        if (!user) return null

        const bungieAccount = user.accounts[0]
        if (!bungieAccount) throw new Error("Bungie account not found")

        return {
            ...user,
            email: user.email ?? "",
            raidHubAccessToken: user.raidHubAccessToken,
            bungieAccount
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
                                isPrimary: true,
                                destinyMembershipId: true,
                                destinyMembershipType: true,
                                vanity: true
                            }
                        },
                        raidHubAccessToken: {
                            select: {
                                expiresAt: true,
                                value: true
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
        if (!account) return null

        return {
            ...account.user,
            email: account.user.email ?? "",
            raidHubAccessToken: account.user.raidHubAccessToken,
            bungieAccount: account.user.accounts[0]
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
                        profiles: {
                            select: {
                                isPrimary: true,
                                destinyMembershipId: true,
                                destinyMembershipType: true,
                                vanity: true
                            }
                        },
                        raidHubAccessToken: {
                            select: {
                                expiresAt: true,
                                value: true
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
                ...restOfUser,
                email: restOfUser.email ?? "",
                bungieAccount,
                raidHubAccessToken
            },
            session
        }
    },
    async updateSession(session) {
        return await prisma.session.update({
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
