import { TRPCError } from "@trpc/server"
import { revalidatePath } from "next/cache"
import { zCreateVanity } from "~/util/zod"
import { adminProcedure } from "../../.."

export const createVanity = adminProcedure.input(zCreateVanity).mutation(async ({ input, ctx }) => {
    try {
        const vanity = await ctx.prisma.profile.update({
            where: {
                destinyMembershipId: input.destinyMembershipId
            },
            data: {
                vanity: input.string
            },
            select: {
                vanity: true
            }
        })
        revalidatePath(`/profile/${input.destinyMembershipType}/${input.destinyMembershipId}`)
        revalidatePath(`/user/${vanity.vanity}`)
        return vanity
    } catch (e) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: e instanceof Error ? e.message : "Unknown error"
        })
    }
})
