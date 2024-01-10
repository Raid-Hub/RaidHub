import { TRPCError } from "@trpc/server"
import { adminProcedure } from "../../../middleware"
import { zDeleteVanity } from "~/util/zod"

export const deleteVanity = adminProcedure.input(zDeleteVanity).mutation(async ({ input, ctx }) => {
    try {
        const removed = await ctx.prisma.profile.update({
            where: {
                vanity: input.vanity
            },
            data: {
                vanity: null
            },
            select: {
                destinyMembershipId: true,
                destinyMembershipType: true,
                name: true
            }
        })
        return { ...removed, ...input }
    } catch (e: any) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: e.message
        })
    }
})