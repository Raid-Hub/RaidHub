import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { protectedProcedure } from "../.."

export const updateProfile = protectedProcedure
    .input(
        z.object({
            destinyMembershipId: z.string(),
            data: z.object({
                name: z.string().optional(),
                image: z.string().url().optional(),
                pinnedActivityId: z.string().nullable().optional(),
                profileDecoration: z.string().nullable().optional()
            })
        })
    )
    .mutation(async ({ input, ctx }) => {
        if (
            !ctx.session.user.profiles.some(
                p => p.destinyMembershipId === input.destinyMembershipId
            )
        ) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "You do not have access to this profile."
            })
        }

        return await ctx.prisma.profile.update({
            where: {
                destinyMembershipId: input.destinyMembershipId
            },
            data: input.data
        })
    })
