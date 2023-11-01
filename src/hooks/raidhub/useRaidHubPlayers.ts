import { useQueries } from "@tanstack/react-query"
import { getPlayer, playerQueryKey } from "~/services/raidhub/getPlayer"
import { RaidHubPlayerResponse } from "~/types/raidhub-api"

export function useRaidHubPlayers(membershipIds: string[]) {
    const queries = useQueries({
        queries: membershipIds.map(destinyMembershipId => ({
            queryFn: () => getPlayer(destinyMembershipId),
            queryKey: playerQueryKey(destinyMembershipId),
            retry: 0
        }))
    })

    const players = queries.map(q => q.data).filter((q): q is RaidHubPlayerResponse => Boolean(q))
    const isLoading = queries.some(q => q.isLoading)

    return {
        players,
        isLoading
    }
}
