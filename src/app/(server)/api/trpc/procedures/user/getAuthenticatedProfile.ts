import { TRPCError } from "@trpc/server"
import { protectedProcedure } from "../.."

export const getAuthenticatedProfile = protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id
    try {
        const data = await ctx.prisma.profile.findUnique({
            where: {
                userId: userId
            }
        })
        return data
    } catch (e) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: e instanceof Error ? e.message : "Unknown error"
        })
    }
})
