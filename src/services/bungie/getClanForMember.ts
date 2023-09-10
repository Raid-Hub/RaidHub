import { getGroupsForMember } from "bungie-net-core/endpoints/GroupV2"
import { BungieMembershipType } from "bungie-net-core/models"
import BungieClient from "./client"

export const getClanForMember =
    (client: BungieClient) =>
    async ({
        membershipId,
        membershipType
    }: {
        membershipId: string
        membershipType: BungieMembershipType
    }) => {
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
