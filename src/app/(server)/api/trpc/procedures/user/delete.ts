import { protectedProcedure } from "../.."

export const deleteUser = protectedProcedure.mutation(async ({ ctx }) => {
    const deleted = await ctx.prisma.user.delete({
        where: {
            id: ctx.session.user.id
        },
        include: {
            profiles: true
        }
    })
    return deleted
})
