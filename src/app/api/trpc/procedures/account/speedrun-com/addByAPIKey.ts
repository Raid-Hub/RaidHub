import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { protectedProcedure } from "../../.."

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
                    id,
                    weblink,
                    names: { international: username }
                }
            } = z
                .object({
                    data: z.object({
                        id: z.string(),
                        weblink: z.string().url(),
                        names: z.object({
                            international: z.string()
                        })
                    })
                })
                .parse(data)

            await ctx.prisma.account.create({
                data: {
                    displayName: username,
                    provider: "speedrun",
                    providerAccountId: id,
                    type: "api-key",
                    url: weblink,
                    user: {
                        connect: {
                            id: ctx.session.user.id
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
