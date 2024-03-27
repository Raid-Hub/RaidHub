import { Collection } from "@discordjs/collection"
import { useQueries, useQuery, type UseQueryOptions } from "@tanstack/react-query"
import { useCallback, useMemo, useState } from "react"
import type { RaidHubPlayerActivitiesResponse } from "~/services/raidhub/types"
import { getRaidHubApi } from "./common"

export const useRaidHubActivtiesFirstPage = <T = RaidHubPlayerActivitiesResponse>(
    membershipId: string,
    opts?: UseQueryOptions<RaidHubPlayerActivitiesResponse, Error, T>
) => {
    return useQuery(useMemo(() => generateQuery(opts)(membershipId), [membershipId, opts]))
}

export const useRaidHubActivities = (
    membershipIds: string[],
    opts?: {
        enabled?: boolean
    }
) => {
    // Collection of membership IDs and their cursors
    const [cursors, setCursors] = useState(() => new Collection<string, Set<string>>())

    const _generateQuery = useCallback(
        <T = RaidHubPlayerActivitiesResponse>(
            membershipId: string,
            cursor?: string,
            overrides?: UseQueryOptions<RaidHubPlayerActivitiesResponse, Error, T>
        ) =>
            generateQuery({
                ...opts,
                ...overrides
            })(membershipId, cursor),
        [opts]
    )

    const queriesOptions = useMemo(
        () =>
            [
                [
                    membershipIds.map(membershipId =>
                        _generateQuery(membershipId, undefined, {
                            onSuccess: data => {
                                setCursors(oldCursors => {
                                    // Clear the old cursors when we get the first set again
                                    oldCursors.get(membershipId)?.clear()
                                    return oldCursors
                                        .clone()
                                        .set(
                                            membershipId,
                                            new Set(data.nextCursor ? [data.nextCursor] : [])
                                        )
                                })
                            }
                        })
                    )
                ],
                cursors.map((cursors, membershipId) =>
                    Array.from(cursors).map(cursor => _generateQuery(membershipId, cursor))
                )
            ].flat(2),
        [membershipIds, cursors, _generateQuery]
    )

    const queries = useQueries({
        queries: queriesOptions
    })

    // This updates the cursors collection with the next cursors from the queries
    queries.forEach(query => {
        if (query.data) {
            const { membershipId, nextCursor } = query.data
            if (!nextCursor) return

            const membershipCursors = cursors.get(membershipId)
            if (membershipCursors?.has(nextCursor)) return

            setCursors(oldCursors => {
                const newCursors = oldCursors.clone()
                if (!membershipCursors) {
                    newCursors.set(membershipId, new Set([nextCursor]))
                } else {
                    newCursors.get(membershipId)!.add(nextCursor)
                }
                return newCursors
            })
        }
    })

    return useMemo(
        () => ({
            activities: new Collection(
                queries.flatMap(q => q.data?.activities ?? []).map(a => [a.instanceId, a])
            ).sort((a, b) => (b.dateStarted < a.dateStarted ? -1 : 1)),
            isLoading: queries.some(q => q.isLoading)
        }),
        [queries]
    )
}

export const generateQuery =
    <T = RaidHubPlayerActivitiesResponse>(
        opts?: UseQueryOptions<RaidHubPlayerActivitiesResponse, Error, T>
    ) =>
    (
        membershipId: string,
        cursor?: string
    ): UseQueryOptions<RaidHubPlayerActivitiesResponse, Error, T> => ({
        queryKey: ["raidhub", "player", "activities", membershipId, cursor] as const,
        queryFn: () =>
            getActivities({
                membershipId,
                cursor
            }),
        staleTime: 60_000,
        ...opts
    })

async function getActivities({ membershipId, cursor }: { membershipId: string; cursor?: string }) {
    const response = await getRaidHubApi(
        "/player/{membershipId}/activities",
        { membershipId },
        { cursor }
    )
    return response
}
