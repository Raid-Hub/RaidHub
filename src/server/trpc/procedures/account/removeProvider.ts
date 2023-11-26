import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { protectedProcedure } from "../../middleware"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

// delete account from user
export const removeProvider = protectedProcedure
    .input(
        z.object({
            providerId: z.enum(["discord", "twitch", "twitter", "google", "speedrun"])
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
            if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
                return
            }
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: e.message
            })
        }
    })
