import { z } from "zod"
import { protectedProcedure } from "../.."
import { providerIdToUsernamePropMap } from "@/server/next-auth/providerIdMap"
import { TRPCError } from "@trpc/server"

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
