import { useQuery } from "@tanstack/react-query"
import { getGroup } from "bungie-net-core/endpoints/GroupV2"
import { GroupResponse } from "bungie-net-core/models"
import { useBungieClient } from "~/app/(layout)/managers/session/BungieClientProvider"

export const useClan = (
    params: { groupId: string },
    opts?: {
        staleTime?: number
        initialData?: GroupResponse
        suspense?: boolean
    }
) => {
    const bungieClient = useBungieClient()

    return useQuery({
        queryKey: ["bungie", "clan", params] as const,
        queryFn: ({ queryKey }) => getGroup(bungieClient, queryKey[2]).then(res => res.Response),
        ...opts
    })
}
