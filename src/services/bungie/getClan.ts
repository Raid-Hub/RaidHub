import { BungieClientProtocol } from "bungie-net-core"
import { getGroupsForMember } from "bungie-net-core/endpoints/GroupV2"
import { BungieMembershipType, GroupV2 } from "bungie-net-core/models"

export async function getClan({
    membershipId,
    membershipType,
    client
}: {
    membershipId: string
    membershipType: BungieMembershipType
    client: BungieClientProtocol
}): Promise<GroupV2 | null> {
    const res = await getGroupsForMember(client, {
        filter: 0, // GroupsForMemberFilter.All
        groupType: 1, // GroupType.Clan
        membershipId,
        membershipType
    })
    const clan = res.Response.results[0]
    if (!clan) return null

    return clan.group
}
