import { useQueries, useQuery } from "@tanstack/react-query"
import { getRaidHubApi } from "~/services/raidhub/common"
import { type RaidHubPlayerResponse } from "~/services/raidhub/types"

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
                ),
            queryKey: ["raidhub", "player", membershipId] as const
        })),
        ...opts
    })

    const players = queries.map(q => q.data).filter((data): data is RaidHubPlayerResponse => !!data)
    const isLoading = queries.some(q => q.isLoading)

    return {
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
