import { Collection } from "@discordjs/collection"
import { useQueries } from "@tanstack/react-query"
import { activitiesQueryKey, getAllActivities } from "~/services/raidhub/getActivities"

export function useRaidHubActivities(membershipIds: string[]) {
    const queries = useQueries({
        queries: membershipIds.map(membershipId => ({
            queryKey: activitiesQueryKey(membershipId),
            queryFn: () => getAllActivities(membershipId),
            staleTime: 60_000,
            retry: 0
        }))
    })

    const activities = new Collection(
        queries.flatMap(q => q.data ?? []).map(a => [a.activityId, a])
    )
    const isLoading = queries.some(q => q.isLoading)

    return {
        activities,
        isLoading
    }
}
