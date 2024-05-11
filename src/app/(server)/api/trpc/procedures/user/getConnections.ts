import { TRPCError } from "@trpc/server"
import { protectedProcedure } from "../.."

export const getConnections = protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id

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

    if (!data) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found"
        })
    }

    return new Map(data.accounts.map(({ provider, displayName }) => [provider, displayName]))
})
