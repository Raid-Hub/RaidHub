import DestinyPGCR from "~/models/pgcr/PGCR"
import { getPostGameCarnageReport } from "bungie-net-core/endpoints/Destiny2"
import { BungieClientProtocol } from "bungie-net-core"
import { BungieAPIError } from "~/models/errors/BungieAPIError"
import { getRaidHubPGCR } from "../raidhub/getPGCR"

export const getPGCR = {
    key: "pgcr",
    fn:
        (client: BungieClientProtocol) =>
        async ({ activityId, filtered = false }: { activityId: string; filtered?: boolean }) => {
            try {
                const res = await getPostGameCarnageReport(client, { activityId })
                return new DestinyPGCR(res.Response, {
                    filtered
                })
            } catch (error) {
                if (
                    error instanceof Error &&
                    (error.name === "AbortError" ||
                        (error instanceof BungieAPIError && error.ErrorCode === 5))
                ) {
                    const res = await getRaidHubPGCR(activityId)
                    return new DestinyPGCR(res, {
                        filtered
                    })
                } else {
                    throw error
                }
            }
        }
}
