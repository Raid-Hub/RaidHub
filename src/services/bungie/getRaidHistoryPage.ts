import {
    BungieMembershipType,
    DestinyActivityModeType,
    DestinyHistoricalStatsPeriodGroup
} from "bungie-net-core/lib/models"
import { getActivityHistory } from "bungie-net-core/lib/endpoints/Destiny2"
import { BungieClientProtocol } from "bungie-net-core/lib/api"

export const ACTIVITIES_PER_PAGE = 250

export async function getRaidHistoryPage({
    characterId,
    destinyMembershipId,
    membershipType,
    page,
    client
}: {
    destinyMembershipId: string
    characterId: string
    membershipType: BungieMembershipType
    page: number
    client: BungieClientProtocol
}): Promise<DestinyHistoricalStatsPeriodGroup[]> {
    const res = await getActivityHistory(
        {
            characterId,
            destinyMembershipId,
            membershipType,
            page,
            mode: DestinyActivityModeType.Raid,
            count: ACTIVITIES_PER_PAGE
        },
        client
    )
    return res.Response.activities ?? []
}
