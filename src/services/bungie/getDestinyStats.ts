import { BungieMembershipType, DestinyHistoricalStatsAccountResult } from "bungie-net-core/models"
import { getHistoricalStatsForAccount } from "bungie-net-core/endpoints/Destiny2"
import { BungieClientProtocol } from "bungie-net-core/api"

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
