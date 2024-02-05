import { useQueries } from "@tanstack/react-query"
import { getMembersOfGroup } from "bungie-net-core/endpoints/GroupV2"
import { useBungieClient } from "~/app/managers/BungieTokenManager"

export const useMembersOfGroup = (params: { groupId: string; pages: number }) => {
    const bungieClient = useBungieClient()

    return useQueries({
        queries: Array.from({ length: params.pages }, (_, page) => ({
            queryKey: ["bungie", "clan members", params.groupId, page] as const,
            queryFn: () =>
                getMembersOfGroup(bungieClient, {
                    groupId: params.groupId,
                    currentpage: page + 1
                }).then(res => res.Response)
        }))
    })
}
