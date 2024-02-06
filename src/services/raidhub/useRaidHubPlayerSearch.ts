import { useQuery } from "@tanstack/react-query"
import { getRaidHubApi } from "~/services/raidhub"

export const useRaidHubPlayerSearch = (searchTerm: string) => {
    return useQuery({
        queryKey: ["raidhub", "player search", searchTerm] as const,
        queryFn: ({ queryKey, signal }) =>
            getRaidHubApi(
                "/player/search",
                null,
                {
                    count: 20,
                    query: queryKey[2]
                },
                {
                    signal: signal
                }
            ).then(data => data.results),
        keepPreviousData: true,
        enabled: searchTerm.length > 0
    })
}
