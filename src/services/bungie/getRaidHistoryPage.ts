import { BungieClientProtocol } from "bungie-net-core"
import { BungieMembershipType, DestinyHistoricalStatsPeriodGroup } from "bungie-net-core/models"
import { getActivityHistory } from "bungie-net-core/endpoints/Destiny2"

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
    const res = await getActivityHistory(client, {
        characterId,
        destinyMembershipId,
        membershipType,
        page,
        mode: 4, //DestinyActivityModeType.Raid,
        count: ACTIVITIES_PER_PAGE
    })
    return res.Response.activities ?? []
}
