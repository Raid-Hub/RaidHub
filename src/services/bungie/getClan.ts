import { getGroup as getBungieGroup, getMembersOfGroup } from "bungie-net-core/endpoints/GroupV2"
import BungieClient from "./client"

export const getClan =
    (client: BungieClient) =>
    async ({ groupId }: { groupId: string }) => {
        const [group, groupMembers] = await Promise.all([
            getBungieGroup(client, {
                groupId
            }),
            getMembersOfGroup(client, {
                groupId,
                currentpage: 1
            }),
            getMembersOfGroup(client, {
                groupId,
                currentpage: 2
            })
        ]).then(
            ([groupRes, membersRes, membersRes2]) =>
                [
                    groupRes.Response,
                    [...membersRes.Response.results, ...membersRes2.Response.results]
                ] as const
        )

        return {
            ...group,
            groupMembers
        }
    }
