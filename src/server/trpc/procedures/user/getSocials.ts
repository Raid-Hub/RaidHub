import { TRPCError } from "@trpc/server"
import { protectedProcedure } from "../../middleware"

export const getSocials = protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id
    try {
        const data = await ctx.prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                profile: {
                    select: {
                        bungieUsername: true,
                        twitchUsername: true,
                        discordUsername: true,
                        twitterUsername: true
                    }
                }
            }
        })
        if (data) {
            return data.profile
        } else {
            throw Error("Profile not found")
        }
    } catch (e: any) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: e.message
        })
    }
})
