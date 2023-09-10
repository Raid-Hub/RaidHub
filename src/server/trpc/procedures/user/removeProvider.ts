import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { protectedProcedure } from "../../middleware"
import { providerIdToUsernamePropMap } from "~/server/next-auth/providerIdMap"

// delete account from user
export const removeProvider = protectedProcedure
    .input(
        z.object({
            providerId: z.enum(["discord", "twitch", "twitter"])
        })
    )
    .mutation(async ({ input, ctx }) => {
        const userId = ctx.session.user.id
        const providerId = input.providerId

        try {
            await Promise.all([
                ctx.prisma.user.update({
                    where: { id: userId },
                    data: {
                        profile: {
                            update: {
                                [providerIdToUsernamePropMap[providerId]]: null
                            }
                        }
                    }
                }),
                ctx.prisma.account
                    .delete({
                        where: {
                            provider_userId: {
                                provider: providerId,
                                userId: userId
                            }
                        }
                    })
                    .catch(console.error)
            ])
        } catch (e: any) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: e.message
            })
        }
    })
