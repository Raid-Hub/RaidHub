import { useQuery } from "@tanstack/react-query"
import { getPostGameCarnageReport } from "bungie-net-core/endpoints/Destiny2"
import { useBungieClient } from "~/layout/managers/session/BungieClientProvider"

export const usePostGameCarnageReport = (params: { activityId: string }) => {
    const bungieClient = useBungieClient()

    return useQuery({
        queryKey: ["bungie", "pgcr", params] as const,
        queryFn: ({ queryKey }) =>
            getPostGameCarnageReport(bungieClient, queryKey[2]).then(res => res.Response)
    })
}
