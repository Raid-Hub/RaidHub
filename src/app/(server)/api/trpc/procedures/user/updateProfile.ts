import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { protectedProcedure } from "../.."

export const updateProfile = protectedProcedure
    .input(
        z.object({
            name: z.string().optional(),
            image: z.string().url().optional(),
            pinnedActivityId: z.string().nullable().optional(),
            profileDecoration: z.string().nullable().optional()
        })
    )
    .mutation(async ({ input, ctx }) => {
        try {
            const profile = await ctx.prisma.profile.update({
                where: {
                    userId: ctx.session.user.id
                },
                data: input
            })
            return profile
        } catch (e: any) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: e.message
            })
        }
    })
