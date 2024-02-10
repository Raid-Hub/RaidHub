import { UseQueryOptions, useQueries } from "@tanstack/react-query"
import { getMembersOfGroup } from "bungie-net-core/endpoints/GroupV2"
import { SearchResultOfGroupMember } from "bungie-net-core/models"
import { useBungieClient } from "~/app/managers/session/BungieClientProvider"

type QueryOptions<T> = UseQueryOptions<SearchResultOfGroupMember, Error, T>

export const useMembersOfGroup = <T = SearchResultOfGroupMember>(
    params: { groupId: string; pages: number },
    opts?: Omit<QueryOptions<T>, "queryKey" | "queryFn">
) => {
    const bungieClient = useBungieClient()

    return useQueries({
        queries: Array.from<unknown, QueryOptions<T>>({ length: params.pages }, (_, page) => ({
            queryKey: ["bungie", "clan members", params.groupId, page] as const,
            queryFn: () =>
                getMembersOfGroup(bungieClient, {
                    groupId: params.groupId,
                    currentpage: page + 1
                }).then(res => res.Response),
            ...opts
        }))
    })
}
