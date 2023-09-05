import { protectedProcedure } from "../.."
import { TRPCError } from "@trpc/server"

export const deleteUser = protectedProcedure.mutation(async ({ ctx }) => {
    try {
        const { profile } = await ctx.prisma.user.delete({
            where: {
                id: ctx.session.user.id
            },
            select: {
                profile: true
            }
        })
        return profile
    } catch (e: any) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: e.message
        })
    }
})
