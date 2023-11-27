import { TRPCError } from "@trpc/server"
import { protectedProcedure } from "../../middleware"

export const getConnections = protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id
    try {
        const data = await ctx.prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                accounts: {
                    select: {
                        provider: true,
                        displayName: true
                    },
                    where: {
                        provider: {
                            in: ["discord", "twitch", "twitter", "google", "speedrun"]
                        }
                    }
                }
            }
        })

        if (data) {
            return new Map(
                data.accounts.map(({ provider, displayName }) => [provider, displayName])
            )
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
