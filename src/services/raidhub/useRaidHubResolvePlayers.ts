import { useQuery } from "@tanstack/react-query"
import { getRaidHubApi } from "~/services/raidhub"
import { RaidHubPlayerBasicResponse } from "~/types/raidhub-api"

export function useRaidHubResolvePlayer(
    membershipId: string,
    opts?: {
        initialData?: RaidHubPlayerBasicResponse
        enabled?: boolean
        staleTime?: number
    }
) {
    return useQuery({
        queryFn: ({ queryKey }) =>
            getRaidHubApi("/player/{membershipId}/basic", { membershipId: queryKey[3] }, null),
        queryKey: ["raidhub", "player", "basic", membershipId] as const,
        ...opts
    })
}
