import { TRPCError } from "@trpc/server"
import { protectedProcedure } from "~/server/trpc/middleware"

export const removeSrcName = protectedProcedure.mutation(async ({ ctx }) => {
    try {
        await ctx.prisma.user.update({
            where: {
                id: ctx.session.user.id
            },
            data: {
                profile: {
                    update: {
                        speedrunUsername: null
                    }
                }
            }
        })
        return { success: true }
    } catch (e: any) {
        console.error(e)
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: e.message
        })
    }
})
