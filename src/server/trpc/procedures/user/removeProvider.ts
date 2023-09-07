import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { protectedProcedure } from "../../middleware"

// delete account from user
export const removeProvider = protectedProcedure
    .input(
        z.object({
            providerId: z.string()
        })
    )
    .mutation(async ({ input, ctx }) => {
        const userId = ctx.session.user.id
        const providerId = input.providerId

        try {
            await ctx.prisma.account.delete({
                where: {
                    provider_userId: {
                        provider: providerId,
                        userId: userId
                    }
                }
            })
        } catch (e: any) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: e.message
            })
        }
    })
