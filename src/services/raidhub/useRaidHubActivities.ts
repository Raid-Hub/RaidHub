import { Collection } from "@discordjs/collection"
import { useQueries } from "@tanstack/react-query"
import { RaidHubPlayerActivitiesActivity } from "~/types/raidhub-api"
import { getRaidHubApi } from "."

export function useRaidHubActivities(membershipIds: string[]) {
    const queries = useQueries({
        queries: membershipIds.map(membershipId => ({
            queryKey: ["raidhub", "player activities", membershipId] as const,
            queryFn: () => getAllActivities(membershipId),
            staleTime: 60_000,
            retry: 0
        }))
    })

    const activities = new Collection(
        queries.flatMap(q => q.data ?? []).map(a => [a.instanceId, a])
    )
    const isLoading = queries.some(q => q.isLoading)

    return {
        activities,
        isLoading
    }
}

export async function getAllActivities(membershipId: string) {
    const all = new Array<RaidHubPlayerActivitiesActivity>()
    let cursor = undefined
    do {
        const data = await getActivities({ membershipId, cursor })
        all.push(...data.activities)
        cursor = data.nextCursor
    } while (cursor)

    return all
}

async function getActivities({ membershipId, cursor }: { membershipId: string; cursor?: string }) {
    const response = await getRaidHubApi(
        "/player/{membershipId}/activities",
        { membershipId },
        { cursor }
    )
    return response
}
