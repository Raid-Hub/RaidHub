import { useQueries, useQuery } from "@tanstack/react-query"
import { getRaidHubApi } from "~/services/raidhub/common"
import { type RaidHubPlayerProfileResponse } from "./types"

export function useRaidHubPlayers(
    membershipIds: string[],
    opts?: {
        enabled?: boolean
    }
) {
    const queries = useQueries({
        queries: membershipIds.map(membershipId => ({
            queryFn: () =>
                getRaidHubApi(
                    "/player/{membershipId}/profile",
                    { membershipId: membershipId },
                    null
                ).then(res => res.response),
            queryKey: ["raidhub", "player", membershipId] as const
        })),
        ...opts
    })

    const players = queries
        .map(q => q.data)
        .filter((data): data is RaidHubPlayerProfileResponse => !!data)
    const isLoading = queries.some(q => q.isLoading)

    return {
        refetch: () => queries.forEach(q => q.refetch()),
        players,
        isLoading
    }
}

export const useRaidHubPlayer = (
    membershipId: string,
    opts?: {
        enabled?: boolean
    }
) =>
    useQuery({
        queryFn: ({ queryKey }) =>
            getRaidHubApi("/player/{membershipId}/profile", { membershipId: queryKey[2] }, null),
        queryKey: ["raidhub", "player", membershipId] as const,
        ...opts
    })
