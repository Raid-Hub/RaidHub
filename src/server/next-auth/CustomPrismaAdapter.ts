import { Adapter, AdapterAccount } from "next-auth/adapters"
import { Account, PrismaClient } from "@prisma/client"
import prisma from "../prisma"
import { z } from "zod"
import { zUser, zUsernames } from "~/util/zod"
import { DiscordProfile } from "next-auth/providers/discord"
import { TwitterProfile } from "next-auth/providers/twitter"

export default function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
    return {
        async createUser(user) {
            const parsedUser = zUser.parse(user)
            const usernames = zUsernames.parse(user)
            const [bungieAccessToken, bungieRefreshToken] = z
                .array(
                    z.object({
                        value: z.string(),
                        expires: z.date()
                    })
                )
                .parse([user.bungieAccessToken, user.bungieRefreshToken])

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
            if (account.provider === "discord") {
                await addDiscordAccountToUser(account)
            } else if (account.provider === "twitch") {
                await addTwitchAccountToUser(account)
            } else if (account.provider === "twitter") {
                await addTwitterAccountToUser(account)
            } else if (account.provider === "google") {
                await addYoutubeAccountToUser(account)
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
        where: {
            id: account.userId
        },
        data: {
            profile: {
                update: {
                    data: {
                        discordUsername: profile.username
                    }
                }
            }
        }
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
        where: {
            id: account.userId
        },
        data: {
            profile: {
                update: {
                    data: {
                        twitchUsername: profile.display_name
                    }
                }
            }
        }
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
        where: {
            id: account.userId
        },
        data: {
            profile: {
                update: {
                    data: {
                        twitterUsername: profile.username
                    }
                }
            }
        }
    })
}

async function addYoutubeAccountToUser(account: AdapterAccount) {
    const url = new URL("https://www.googleapis.com/youtube/v3/channels")
    url.searchParams.set("part", "snippet")
    url.searchParams.set("mine", "true")

    const profile = await fetch(url, {
        headers: {
            Authorization: `Bearer ${account.access_token}`
        }
    }).then(async res => {
        const data = await res.json()
        if (res.ok) {
            return data as {
                kind: string
                etag: string
                pageInfo: { totalResults: number; resultsPerPage: number }
                items: {
                    kind: string
                    etag: string
                    id: string
                    snippet: {
                        title: string
                        description: string
                        customUrl?: string
                        publishedAt: string
                        thumbnails: { default: Object; medium: Object; high: Object }
                        localized: {
                            title: string
                            description: string
                        }
                        country: string
                    }
                }[]
            }
        } else {
            throw data
        }
    })

    const username = profile.items.find(i => i.kind === "youtube#channel")!.snippet.customUrl!

    return prisma.user.update({
        where: {
            id: account.userId
        },
        data: {
            profile: {
                update: {
                    data: {
                        youtubeUsername: username
                    }
                }
            }
        }
    })
}
