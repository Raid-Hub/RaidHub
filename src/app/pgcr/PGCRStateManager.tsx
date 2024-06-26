"use client"

import { Collection, type ReadonlyCollection } from "@discordjs/collection"
import { useQueryClient, type UseQueryResult } from "@tanstack/react-query"
import { createContext, useContext, useEffect, type ReactNode } from "react"
import { useRaidHubActivity } from "~/services/raidhub/hooks"
import {
    type RaidHubInstanceExtended,
    type RaidHubInstancePlayerExtended,
    type RaidHubPlayerInfo
} from "~/services/raidhub/types"
import { round } from "~/util/math"
import type { PGCRPageProps } from "./types"

const PGCRContext = createContext<
    | (UseQueryResult<RaidHubInstanceExtended> & { sortScores: ReadonlyCollection<string, number> })
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
            queryClient.setQueryData<RaidHubInstanceExtended>(
                ["raidhub", "activity", instanceId],
                old => old ?? ssrActivity
            )
            ssrActivity.players.forEach(entry => {
                queryClient.setQueryData<RaidHubPlayerInfo>(
                    ["raidhub", "player", "basic", entry.playerInfo.membershipId],
                    old => old ?? entry.playerInfo
                )
            })
        }
    }, [queryClient, ssrActivity, instanceId])

    const activityQuery = useRaidHubActivity(instanceId, {
        enabled: isReady,
        staleTime: 3600_000
    })

    const sortScores = new Collection(
        activityQuery.data?.players.map(p => [p.playerInfo.membershipId, sortScore(p)])
    ).toSorted((a, b) => b - a)

    return (
        <PGCRContext.Provider value={{ ...activityQuery, sortScores }}>
            {children}
        </PGCRContext.Provider>
    )
}

function sortScore(d: RaidHubInstancePlayerExtended) {
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

    const adjustedTimePlayedSeconds = Math.min(d.timePlayedSeconds || 1, 32767)
    // kills weighted 2x assists, slight diminishing returns
    const killScore =
        (100 * (stats.kills + 0.5 * stats.assists) ** 0.95) /
            (round(adjustedTimePlayedSeconds, -1) || 1) +
        stats.kills / 400

    // a multiplier based on your time per deaths squared, normalized a bit by using deaths + 7
    const deathScore = ((1 / 6) * adjustedTimePlayedSeconds) / (stats.deaths + 7) ** 0.95

    const timeScore = 50 * (adjustedTimePlayedSeconds / 3600) // 50 points per hour

    const precisionScore = (stats.precisionKills / (stats.kills || 1)) * 10 // 1 point per 10% of kills

    const superScore = (stats.superKills / (adjustedTimePlayedSeconds / 60)) * 5 // 1 point per super kill per minute

    const completionScore = d.completed ? 1 : 0.5

    const raidhubScore =
        (killScore * deathScore + timeScore + precisionScore + superScore) * completionScore

    return raidhubScore * Math.max(stats.score, 1)
}
