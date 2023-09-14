import { getGroup, getGroupsForMember, getMembersOfGroup } from "bungie-net-core/endpoints/GroupV2"
import BungieClient from "../../util/bungieClient"
import { BungieMembershipType } from "bungie-net-core/models"

export const getClan =
    (client: BungieClient) =>
    async ({ groupId }: { groupId: string }) => {
        const res = await getGroup(client, {
            groupId
        })
        return res.Response
    }

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

export const getClanMembers =
    (client: BungieClient) =>
    async ({ groupId }: { groupId: string }) => {
        const responses = await Promise.all([
            getMembersOfGroup(client, {
                groupId,
                currentpage: 1
            }),
            getMembersOfGroup(client, {
                groupId,
                currentpage: 2
            })
        ])

        return responses.map(res => res.Response.results).flat()
    }
