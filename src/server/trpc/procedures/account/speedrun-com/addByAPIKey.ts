import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { protectedProcedure } from "~/server/trpc/middleware"

export const addByAPIKey = protectedProcedure
    .input(
        z.object({
            apiKey: z.string()
        })
    )
    .mutation(async ({ input, ctx }) => {
        const url = "https://www.speedrun.com/api/v1/profile"
        const headers = {
            Accept: "application/json",
            "X-API-Key": input.apiKey
        }

        try {
            const data = await fetch(url, {
                method: "GET",
                headers: headers
            }).then(async res => {
                const json = await res.json()
                if (res.ok) {
                    return json
                } else if (res.status === 403) {
                    throw new Error("Invalid API Key")
                } else {
                    throw new Error("IDK")
                }
            })

            const {
                data: {
                    names: { international: username }
                }
            } = z
                .object({
                    data: z.object({
                        names: z.object({
                            international: z.string()
                        })
                    })
                })
                .parse(data)

            await ctx.prisma.user.update({
                where: {
                    id: ctx.session.user.id
                },
                data: {
                    profile: {
                        update: {
                            speedrunUsername: username
                        }
                    }
                }
            })

            return {
                username: username
            }
        } catch (e: any) {
            console.error(e)
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: e.message
            })
        }
    })
