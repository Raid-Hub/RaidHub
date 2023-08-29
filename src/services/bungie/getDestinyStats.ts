import { DestinyHistoricalStatsAccountResult, BungieMembershipType } from "bungie-net-core/models"
import { BungieClientProtocol } from "bungie-net-core"
import { getHistoricalStatsForAccount } from "bungie-net-core/endpoints/Destiny2"

export async function getDestinyStats({
    destinyMembershipId,
    membershipType,
    client
}: {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    client: BungieClientProtocol
}): Promise<DestinyHistoricalStatsAccountResult> {
    const stats = await getHistoricalStatsForAccount(client, {
        destinyMembershipId,
        membershipType
    })
    return stats.Response
}
