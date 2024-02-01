import { z } from "zod"
import { postRaidHubApi } from "~/services/raidhub"
import { adminProcedure } from "../../middleware"

export const rawSqlQuery = adminProcedure
    .input(z.object({ query: z.string(), timeout: z.number().nonnegative().int().default(5000) }))
    .mutation(async ({ input, ctx }) => {
        try {
            const data = await postRaidHubApi(
                "/admin/query",
                null,
                { query: input.query },
                {
                    Authorization: "Bearer " + ctx.session.raidHubAccessToken?.value
                }
            )
        } catch (e) {
            if (e instanceof DOMException) {
                throw new Error("Query timed out")
            } else throw e
        }
    })
