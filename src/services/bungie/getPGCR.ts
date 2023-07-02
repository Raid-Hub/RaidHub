import { getPostGameCarnageReport } from "bungie-net-core/endpoints/Destiny2"
import { BungieClientProtocol } from "bungie-net-core/api"
import DestinyPGCR from "../../models/pgcr/PGCR"

export async function getPGCR({
    activityId,
    client
}: {
    activityId: string
    client: BungieClientProtocol
}): Promise<DestinyPGCR> {
    const res = await getPostGameCarnageReport({ activityId }, client)
    return new DestinyPGCR(res.Response, {
        filtered: true
    })
}
