import { useQuery, useQueryClient } from "@tanstack/react-query"
import { type RaidHubActivityResponse, type RaidHubPlayerBasic } from "~/services/raidhub/types"
import { getRaidHubApi } from "./common"

export const useRaidHubActivity = (
    activityId: string,
    opts?: {
        enabled?: boolean
        initialData?: RaidHubActivityResponse
        suspense?: boolean
        staleTime?: number
        placeholderData?: RaidHubActivityResponse
    }
) => {
    const queryClient = useQueryClient()
    return useQuery({
        queryKey: ["raidhub", "activity", activityId] as const,
        queryFn: ({ queryKey }) =>
            getRaidHubApi("/activity/{instanceId}", { instanceId: queryKey[2] }, null),
        staleTime: 3600_000,
        onSuccess: data => {
            data.players.forEach(entry => {
                queryClient.setQueryData<RaidHubPlayerBasic>(
                    ["raidhub", "player", "basic", entry.player.membershipId],
                    old => old ?? entry.player
                )
            })
        },
        ...opts
    })
}
