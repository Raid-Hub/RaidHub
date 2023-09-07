import DestinyPGCR from "~/models/pgcr/PGCR"
import { BungieClientProtocol } from "bungie-net-core"
import { getPostGameCarnageReport } from "bungie-net-core/endpoints/Destiny2"

export async function getPGCR({
    activityId,
    client
}: {
    activityId: string
    client: BungieClientProtocol
}): Promise<DestinyPGCR> {
    const res = await getPostGameCarnageReport(client, { activityId })
    return new DestinyPGCR(res.Response, {
        filtered: true
    })
}
