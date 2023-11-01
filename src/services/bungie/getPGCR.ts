import DestinyPGCR from "~/models/pgcr/PGCR"
import { getPostGameCarnageReport } from "bungie-net-core/endpoints/Destiny2"
import { BungieClientProtocol } from "bungie-net-core"

export const getPGCR = {
    key: "pgcr",
    fn:
        (client: BungieClientProtocol) =>
        async ({ activityId, filtered = false }: { activityId: string; filtered?: boolean }) => {
            const res = await getPostGameCarnageReport(client, { activityId })
            return new DestinyPGCR(res.Response, {
                filtered
            })
        }
}
