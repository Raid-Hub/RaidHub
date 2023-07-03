import {
    BungieMembershipType,
    DestinyHistoricalStatsAccountResult
} from "bungie-net-core/lib/models"
import { getHistoricalStatsForAccount } from "bungie-net-core/lib/endpoints/Destiny2"
import { BungieClientProtocol } from "bungie-net-core/lib/api"

export async function getDestinyStats({
    destinyMembershipId,
    membershipType,
    client
}: {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    client: BungieClientProtocol
}): Promise<DestinyHistoricalStatsAccountResult> {
    const stats = await getHistoricalStatsForAccount(
        {
            destinyMembershipId,
            membershipType
        },
        client
    )
    return stats.Response
}
