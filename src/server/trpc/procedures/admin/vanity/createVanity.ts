import { TRPCError } from "@trpc/server"
import { adminProcedure } from "../../../middleware"
import { zCreateVanity } from "~/util/zod"

export const createVanity = adminProcedure.input(zCreateVanity).mutation(async ({ input, ctx }) => {
    try {
        const vanity = await ctx.prisma.vanity.create({
            data: {
                destinyMembershipId: input.destinyMembershipId,
                destinyMembershipType: input.destinyMembershipType,
                string: input.string,
                profile: {
                    connect: {
                        destinyMembershipId_destinyMembershipType: {
                            destinyMembershipId: input.destinyMembershipId,
                            destinyMembershipType: input.destinyMembershipType
                        }
                    }
                }
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
