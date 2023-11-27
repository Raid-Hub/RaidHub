import { TRPCError } from "@trpc/server"
import { adminProcedure } from "../../../middleware"
import { zCreateVanity } from "~/util/zod"

export const createVanity = adminProcedure.input(zCreateVanity).mutation(async ({ input, ctx }) => {
    try {
        const vanity = await ctx.prisma.profile.update({
            where: {
                destinyMembershipId: input.destinyMembershipId
            },
            data: {
                vanity: input.string.toLowerCase()
            },
            select: {
                vanity: true
            }
        })
        return vanity
    } catch (e: any) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: e.message
        })
    }
})
