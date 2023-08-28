import { BungieClientProtocol } from "bungie-net-core"
import { DestinyAggregateActivityResults, BungieMembershipType } from "bungie-net-core/models"
import { getDestinyAggregateActivityStats } from "bungie-net-core/endpoints/Destiny2"

export async function getDestinyStatsForCharacter({
    destinyMembershipId,
    membershipType,
    characterId,
    client
}: {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    characterId: string
    client: BungieClientProtocol
}): Promise<DestinyAggregateActivityResults> {
    const stats = await getDestinyAggregateActivityStats(client, {
        characterId,
        destinyMembershipId,
        membershipType
    })
    return stats.Response
}
