import { publicProcedure } from "../.."
import { TRPCError } from "@trpc/server"
import { zUniqueDestinyProfile } from "@/util/zod"

export const getVanity = publicProcedure
    .input(zUniqueDestinyProfile)
    .mutation(async ({ input, ctx }) => {
        const { destinyMembershipId, destinyMembershipType } = input
        try {
            const vanity = await ctx.prisma.vanity.findUnique({
                where: {
                    destinyMembershipId_destinyMembershipType: {
                        destinyMembershipId,
                        destinyMembershipType
                    }
                },
                select: {
                    string: true
                }
            })
            return vanity?.string
        } catch (e: any) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: e.message
            })
        }
    })
