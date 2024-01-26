import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { adminProcedure } from "../../middleware"
import { z } from "zod"
import { createHeaders } from "~/services/raidhub/_createHeaders"
import { RaidHubAPIResponse } from "~/types/raidhub-api"
import { getRaidHubBaseUrl } from "~/util/raidhub/getRaidHubUrl"

const url = new URL(getRaidHubBaseUrl() + `/admin/query`)

export const rawSqlQuery = adminProcedure
    .input(z.object({ query: z.string(), timeout: z.number().nonnegative().int().default(5000) }))
    .mutation(async ({ input }) => {
        const controller = new AbortController()
        if (process.env.APP_ENV != "local") {
            setTimeout(() => controller.abort(), input.timeout)
        }

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    ...createHeaders(),
                    "Content-Type": "application/json",
                    "X-Admin-Key": process.env.ADMIN_KEY!
                },
                body: JSON.stringify({ query: input.query }),
                signal: controller.signal
            })

            const data = (await res.json()) as RaidHubAPIResponse<
                Record<string, number | string | null>[],
                PrismaClientKnownRequestError
            >
            if (data.success) {
                return data.response
            } else {
                if (data.error.meta?.message) {
                    throw new Error(data.error.meta.message as string)
                }
                throw new Error(data.message)
            }
        } catch (e) {
            if (e instanceof DOMException) {
                throw new Error("Query timed out")
            } else throw e
        }
    })
