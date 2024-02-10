import { useQuery } from "@tanstack/react-query"
import { getGroup } from "bungie-net-core/endpoints/GroupV2"
import { useBungieClient } from "~/app/managers/session/BungieTokenManager"

export const useClan = (params: { groupId: string }) => {
    const bungieClient = useBungieClient()

    return useQuery({
        queryKey: ["bungie", "clan", params] as const,
        queryFn: ({ queryKey }) => getGroup(bungieClient, queryKey[2]).then(res => res.Response)
    })
}
