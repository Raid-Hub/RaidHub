import DestinyPGCR from "~/models/pgcr/PGCR"
import { getPostGameCarnageReport } from "bungie-net-core/endpoints/Destiny2"
import { BungieClientProtocol } from "bungie-net-core"
import { BungieAPIError } from "~/models/errors/BungieAPIError"
import { getRaidHubBaseUrl } from "~/util/raidhub/getRaidHubUrl"
import { RaidHubAPIResponse } from "~/types/raidhub-api"
import { DestinyPostGameCarnageReportData } from "bungie-net-core/models"

export const getPGCR = {
    key: "pgcr",
    fn:
        (client: BungieClientProtocol) =>
        async ({ activityId, filtered = true }: { activityId: string; filtered?: boolean }) => {
            try {
                const res = await getPostGameCarnageReport(client, { activityId })
                return new DestinyPGCR(res.Response, {
                    filtered
                })
            } catch (e) {
                if (e instanceof BungieAPIError && e.ErrorCode === 5) {
                    // fallback if API is down
                    const report = await getRaidHubRawPGCR(activityId)
                    return new DestinyPGCR(report, {
                        filtered
                    })
                } else {
                    throw e
                }
            }
        }
}

async function getRaidHubRawPGCR(activityId: string) {
    const url = new URL(getRaidHubBaseUrl() + `/pgcr/${activityId}`)

    const res = await fetch(url)

    const data = (await res.json()) as RaidHubAPIResponse<DestinyPostGameCarnageReportData>

    if (data.success) {
        return data.response
    } else {
        throw new Error(data.message)
    }
}
