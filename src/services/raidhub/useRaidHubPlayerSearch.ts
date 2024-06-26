import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getRaidHubApi } from "~/services/raidhub/common"
import { type RaidHubPlayerInfo } from "./types"

export const useRaidHubPlayerSearch = (searchTerm: string) => {
    const queryClient = useQueryClient()
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
            ).then(res => res.response.results),
        onSuccess: data => {
            // This allows us to store this data in the cache for later use
            data.forEach(player => {
                queryClient.setQueryData<RaidHubPlayerInfo>(
                    ["raidhub", "player", "basic", player.membershipId],
                    player
                )
            })
        },
        keepPreviousData: true,
        enabled: searchTerm.length > 0,
        cacheTime: 120_000
    })
}
