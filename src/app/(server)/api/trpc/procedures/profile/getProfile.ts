import { z } from "zod"
import { publicProcedure } from "../.."

export const getProfile = publicProcedure
    .input(
        z.union([
            z.object({
                destinyMembershipId: z.string()
            }),
            z.object({
                vanity: z.string().toLowerCase()
            })
        ])
    )
    .query(async ({ input, ctx }) => {
        const data = await ctx.prisma.profile.findUnique({
            where: input,
            include: {
                user: {
                    select: {
                        accounts: {
                            select: {
                                provider: true,
                                displayName: true,
                                url: true
                            },
                            where: {
                                provider: {
                                    in: ["discord", "twitch", "twitter", "google", "speedrun"]
                                },
                                displayName: {
                                    not: null
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!data?.user) return null

        const {
            user: { accounts },
            ...profile
        } = data

        return {
            ...profile,
            connections: accounts
        }
    })
