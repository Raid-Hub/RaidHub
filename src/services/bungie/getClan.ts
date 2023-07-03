import {
    BungieMembershipType,
    GroupType,
    GroupV2,
    GroupsForMemberFilter
} from "bungie-net-core/lib/models"
import { BungieClientProtocol } from "bungie-net-core/lib/api"
import { ClanBannerData, resolveClanBanner } from "../../util/destiny/clanBanner"
import { getGroupsForMember } from "bungie-net-core/lib/endpoints/GroupV2"

export type Clan = GroupV2 & { clanBanner: ClanBannerData }

export async function getClan({
    membershipId,
    membershipType,
    client
}: {
    membershipId: string
    membershipType: BungieMembershipType
    client: BungieClientProtocol
}): Promise<Clan | null> {
    const res = await getGroupsForMember(
        {
            filter: GroupsForMemberFilter.All,
            groupType: GroupType.Clan,
            membershipId,
            membershipType
        },
        client
    )
    const clan = res.Response.results[0]
    if (!clan) return null

    const group = clan.group
    return {
        ...group,
        clanBanner: resolveClanBanner(group.clanInfo.clanBannerData)
    }
}
