import { z } from "zod"
import { protectedProcedure } from "../.."

export const updateUser = protectedProcedure
    .input(
        z.object({
            destinyMembershipId: z.string(),
            data: z.object({
                name: z.string().optional(),
                image: z.string().nullable().optional()
            })
        })
    )
    .mutation(async ({ input, ctx }) => {
        return await ctx.prisma.user.update({
            where: {
                id: ctx.session.user.id
            },
            data: {
                name: input.data.name,
                image: input.data.image
            }
        })
    })
