import { protectedProcedure } from "../.."
import { TRPCError } from "@trpc/server"
import { zModifiableUser } from "@/util/zod"

export const updateProfile = protectedProcedure
    .input(zModifiableUser.partial())
    .mutation(async ({ input, ctx }) => {
        try {
            const { profile } = await ctx.prisma.user.update({
                where: {
                    id: ctx.session.user.id
                },
                data: {
                    profile: {
                        update: {
                            data: input
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
