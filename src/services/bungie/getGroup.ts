import { BungieClientProtocol } from "bungie-net-core"
import { getGroup as getBungieGroup, getMembersOfGroup } from "bungie-net-core/endpoints/GroupV2"

export async function getGroup({
    groupId,
    client
}: {
    groupId: string
    client: BungieClientProtocol
}) {
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
