import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { publicProcedure } from "../.."

export const getProfileByDestinyMembershipId = publicProcedure
    .input(
        z.object({
            destinyMembershipId: z.string()
        })
    )
    .query(async ({ input, ctx }) => {
        const destinyMembershipId = input.destinyMembershipId
        try {
            const data = await ctx.prisma.profile.findUnique({
                where: {
                    destinyMembershipId: destinyMembershipId
                },
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
                connections: new Map(
                    accounts.map(({ provider, displayName, url }) => [
                        provider,
                        { displayName: displayName!, url }
                    ])
                )
            }
        } catch (e: any) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: e.message
            })
        }
    })
