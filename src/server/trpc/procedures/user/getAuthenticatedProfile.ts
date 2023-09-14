import { TRPCError } from "@trpc/server"
import { protectedProcedure } from "../../middleware"

export const getAuthenticatedProfile = protectedProcedure.query(async ({ ctx }) => {
    const destinyMembershipId = ctx.session.user.destinyMembershipId
    try {
        const data = await ctx.prisma.profile.findUnique({
            where: {
                destinyMembershipId: destinyMembershipId
            },
            include: {
                user: {
                    select: {
                        image: true,
                        name: true
                    }
                }
            }
        })
        if (!data) return null
        const { user, ...profile } = data
        return { ...user, ...profile }
    } catch (e: any) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: e.message
        })
    }
})
