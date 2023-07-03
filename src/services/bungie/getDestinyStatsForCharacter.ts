import { BungieClientProtocol } from "bungie-net-core/lib/api"
import { BungieMembershipType, DestinyAggregateActivityResults } from "bungie-net-core/lib/models"
import { getDestinyAggregateActivityStats } from "bungie-net-core/lib/endpoints/Destiny2"

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
    const stats = await getDestinyAggregateActivityStats(
        {
            characterId,
            destinyMembershipId,
            membershipType
        },
        client
    )
    return stats.Response
}
