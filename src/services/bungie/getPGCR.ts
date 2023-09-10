import DestinyPGCR from "~/models/pgcr/PGCR"
import { getPostGameCarnageReport } from "bungie-net-core/endpoints/Destiny2"
import BungieClient from "../../util/bungieClient"

export const getPGCR =
    (client: BungieClient) =>
    async ({ activityId, filtered = true }: { activityId: string; filtered?: boolean }) => {
        const res = await getPostGameCarnageReport(client, { activityId })
        return new DestinyPGCR(res.Response, {
            filtered
        })
    }
