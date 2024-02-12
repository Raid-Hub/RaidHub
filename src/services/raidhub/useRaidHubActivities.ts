import { Collection } from "@discordjs/collection"
import { useQueries, type UseQueryOptions } from "@tanstack/react-query"
import { useCallback, useMemo, useState } from "react"
import type { RaidHubPlayerActivitiesResponse } from "~/types/raidhub-api"
import { getRaidHubApi } from "."

export function useRaidHubActivities(
    membershipIds: string[],
    opts?: {
        enabled?: boolean
    }
) {
    // Collection of membership IDs and their cursors
    const [cursors, setCursors] = useState(() => new Collection<string, Set<string>>())

    const generateQuery = useCallback(
        (
            membershipId: string,
            cursor?: string
        ): UseQueryOptions<RaidHubPlayerActivitiesResponse> => ({
            queryKey: ["raidhub", "player", "activities", membershipId, cursor] as const,
            queryFn: () =>
                getActivities({
                    membershipId,
                    cursor
                }),
            staleTime: 60_000,
            onSuccess: data => {
                setCursors(oldCursors => {
                    // If there is no next cursor, we can prevent a state update
                    if (!data.nextCursor) return oldCursors
                    // We need to clone the collection for react to register a state update
                    const newCursors = oldCursors.clone()
                    if (!newCursors.has(membershipId)) {
                        newCursors.set(membershipId, new Set([data.nextCursor]))
                    } else {
                        newCursors.get(membershipId)!.add(data.nextCursor)
                    }
                    return newCursors
                })
            },
            ...opts
        }),
        [opts]
    )

    const queriesOptions = useMemo(
        () =>
            [
                [membershipIds.map(membershipId => generateQuery(membershipId))],
                cursors.map((cursors, membershipId) =>
                    Array.from(cursors).map(cursor => generateQuery(membershipId, cursor))
                )
            ].flat(2),
        [membershipIds, cursors, generateQuery]
    )

    const queries = useQueries({
        queries: queriesOptions
    })

    return useMemo(
        () => ({
            activities: new Collection(
                queries.flatMap(q => q.data?.activities ?? []).map(a => [a.instanceId, a])
            ),
            isLoading: queries.some(q => q.isLoading)
        }),
        [queries]
    )
}

async function getActivities({ membershipId, cursor }: { membershipId: string; cursor?: string }) {
    const response = await getRaidHubApi(
        "/player/{membershipId}/activities",
        { membershipId },
        { cursor }
    )
    return response
}
