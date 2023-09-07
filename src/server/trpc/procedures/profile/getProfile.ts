import { z } from "zod"
import { publicProcedure } from "../.."
import { TRPCError } from "@trpc/server"

export const getProfile = publicProcedure
    .input(
        z.object({
            destinyMembershipId: z.string()
        })
    )
    .query(async ({ input, ctx }) => {
        const destinyMembershipId = input.destinyMembershipId
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
