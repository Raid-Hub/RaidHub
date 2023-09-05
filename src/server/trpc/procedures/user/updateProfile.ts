import { zModifiableProfile, zModifiableUser } from "~/util/zod"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { protectedProcedure } from "../../middleware"

export const updateProfile = protectedProcedure
    .input(
        z
            .object({
                profile: zModifiableProfile.partial(),
                user: zModifiableUser.partial()
            })
            .partial()
    )
    .mutation(async ({ input, ctx }) => {
        try {
            const { profile } = await ctx.prisma.user.update({
                where: {
                    id: ctx.session.user.id
                },
                data: {
                    ...input.user,
                    profile: {
                        update: {
                            data: input.profile
                        }
                    }
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
