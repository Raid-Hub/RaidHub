"use client"

import { Collection, type ReadonlyCollection } from "@discordjs/collection"
import { useQueryClient, type UseQueryResult } from "@tanstack/react-query"
import { createContext, useContext, useEffect, type ReactNode } from "react"
import { useRaidHubActivity } from "~/services/raidhub/hooks"
import type {
    RaidHubActivityResponse,
    RaidHubPlayerBasic,
    RaidHubPlayerWithExtendedActivityData
} from "~/services/raidhub/types"
import { round } from "~/util/math"
import type { PGCRPageProps } from "./types"

const PGCRContext = createContext<
    | (UseQueryResult<RaidHubActivityResponse> & { sortScores: ReadonlyCollection<string, number> })
    | undefined
>(undefined)

export const usePGCRContext = () => {
    const ctx = useContext(PGCRContext)
    if (!ctx) throw new Error("usePGCRContext must be used within a PGCRContextProvider")

    return ctx
}

export const PGCRStateManager = ({
    instanceId,
    ssrActivity,
    isReady,
    children
}: PGCRPageProps & { children: ReactNode }) => {
    const queryClient = useQueryClient()

    useEffect(() => {
        if (ssrActivity) {
            queryClient.setQueryData<RaidHubActivityResponse>(
                ["raidhub", "activity", instanceId],
                old => old ?? ssrActivity
            )
            ssrActivity.players.forEach(entry => {
                queryClient.setQueryData<RaidHubPlayerBasic>(
                    ["raidhub", "player", "basic", entry.player.membershipId],
                    old => old ?? entry.player
                )
            })
        }
    }, [queryClient, ssrActivity, instanceId])

    const activityQuery = useRaidHubActivity(instanceId, {
        enabled: isReady,
        staleTime: 3600_000
    })

    const sortScores = new Collection(
        activityQuery.data?.players.map(p => [p.player.membershipId, sortScore(p.data)])
    ).toSorted((a, b) => b - a)

    return (
        <PGCRContext.Provider value={{ ...activityQuery, sortScores }}>
            {children}
        </PGCRContext.Provider>
    )
}

function sortScore(d: RaidHubPlayerWithExtendedActivityData["data"]) {
    const stats = d.characters.reduce(
        (acc, c) => ({
            kills: acc.kills + c.kills,
            deaths: acc.deaths + c.deaths,
            assists: acc.assists + c.assists,
            precisionKills: acc.precisionKills + c.precisionKills,
            superKills: acc.superKills + c.superKills,
            score: acc.score + c.score
        }),
        {
            kills: 0,
            deaths: 0,
            assists: 0,
            precisionKills: 0,
            superKills: 0,
            score: 0
        }
    )

    const adjustedTimePlayedSeconds = d.timePlayedSeconds || 1
    // kills weighted 2x assists, slight diminishing returns
    const killScore =
        (stats.kills + 0.5 * stats.assists) ** 0.95 /
        Math.sqrt(round(adjustedTimePlayedSeconds, -1) || 1)

    // a multiplier based on your time per deaths squared, normalized a bit by using deaths + 7
    const deathScore = (2 * adjustedTimePlayedSeconds) / (stats.deaths + 7) ** 2

    const timeScore = adjustedTimePlayedSeconds / 360 // 10 points per hour

    const precisionScore = (stats.precisionKills / (stats.kills || 1)) * 10 // 1 point per 10% of kills

    const superScore = (stats.superKills / (adjustedTimePlayedSeconds / 60)) * 5 // 1 point per super kill per minute

    const completionScore = d.completed ? 1 : 0.5

    const raidhubScore =
        (killScore * deathScore + timeScore + precisionScore + superScore) * completionScore

    return raidhubScore * Math.max(stats.score, 1)
}
