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
            const profile = await ctx.prisma.profile.findUnique({
                where: {
                    destinyMembershipId: destinyMembershipId
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
