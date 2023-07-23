import {
    BungieMembershipType,
    GroupType,
    GroupV2,
    GroupsForMemberFilter
} from "bungie-net-core/lib/models"
import { BungieClientProtocol } from "bungie-net-core/lib/api"
import { getGroupsForMember } from "bungie-net-core/lib/endpoints/GroupV2"

export async function getClan({
    membershipId,
    membershipType,
    client
}: {
    membershipId: string
    membershipType: BungieMembershipType
    client: BungieClientProtocol
}): Promise<GroupV2 | null> {
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

    return clan.group
}
