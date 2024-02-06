import { useQueries } from "@tanstack/react-query"
import { getRaidHubApi } from "~/services/raidhub"
import { RaidHubPlayerResponse } from "~/types/raidhub-api"

export function useRaidHubPlayers(membershipIds: string[]) {
    const queries = useQueries({
        queries: membershipIds.map(membershipId => ({
            queryFn: () => getRaidHubApi("/player/{membershipId}/profile", { membershipId }, null),
            queryKey: ["raidhub-player", membershipId] as const
        }))
    })

    const players = queries.map(q => q.data).filter((data): data is RaidHubPlayerResponse => !!data)
    const isLoading = queries.some(q => q.isLoading)

    return {
        players,
        isLoading
    }
}
