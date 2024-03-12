"use client"

import type { Collection, ReadonlyCollection } from "@discordjs/collection"
import { useQueryClient } from "@tanstack/react-query"
import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react"
import { mergeWeaponCollections } from "~/app/pgcr/weaponUtils"
import { usePostGameCarnageReport } from "~/services/bungie/hooks"
import { useRaidHubActivity, useRaidHubPGCR } from "~/services/raidhub/hooks"
import type { ListedRaid, RaidHubActivityResponse } from "~/services/raidhub/types"
import { useProcessPGCR } from "./hooks/useProcessPGCR"
import type DestinyPGCRPlayer from "./models/Player"
import type { PGCRPageProps } from "./types"

type PGCRContextValue =
    | ({
          isLoading: false
          raid: ListedRaid | null
          completed: boolean
          hash: number
          completionDate: Date
          duration: number
          activity: RaidHubActivityResponse | undefined
          fresh: boolean | undefined | null
      } & (
          | {
                isPGCRLoading: false
                pgcrPlayers: ReadonlyCollection<string, DestinyPGCRPlayer>
                weightedScores: Collection<string, number>
                weapons: ReadonlyCollection<number, Record<string, number>>
                stats: {
                    kills: number
                    deaths: number
                    assists: number
                    abilityKills: number
                    overallKD: number
                    superKills: number
                    charactersUsed: number
                    mvp: DestinyPGCRPlayer | null
                    mostUsedWeaponHash: number | undefined
                }
            }
          | {
                isPGCRLoading: true
                pgcrPlayers: undefined
                weightedScores: undefined
                stats: undefined
                weapons: undefined
            }
      ))
    | {
          isLoading: true
          raid: undefined
          completed: undefined
          hash: undefined
          completionDate: undefined
          duration: undefined
          activity: undefined
          fresh: undefined
          isPGCRLoading: boolean
          pgcrPlayers: undefined
          weightedScores: undefined
          stats: undefined
          weapons: undefined
      }

const PGCRContext = createContext<PGCRContextValue | undefined>(undefined)

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
        }
    }, [queryClient, ssrActivity, instanceId])

    const activityQuery = useRaidHubActivity(instanceId, {
        enabled: isReady,
        staleTime: 3600_000
    })

    const processPGCR = useProcessPGCR()

    const pgcrQuery = usePostGameCarnageReport(
        { activityId: instanceId },
        {
            staleTime: Infinity,
            select: data => processPGCR(data)
        }
    )

    useRaidHubPGCR(instanceId, {
        enabled: pgcrQuery.isLoadingError // Initial load failed, hit the raidhub endpoint instead
    })

    const ctxValue = useMemo((): PGCRContextValue => {
        if (!(activityQuery.isSuccess || pgcrQuery.isSuccess)) {
            return {
                isLoading: true,
                raid: undefined,
                completed: undefined,
                hash: undefined,
                completionDate: undefined,
                duration: undefined,
                activity: undefined,
                fresh: undefined,
                pgcrPlayers: undefined,
                weightedScores: undefined,
                isPGCRLoading: pgcrQuery.isLoading,
                stats: undefined,
                weapons: undefined
            }
        }

        const weapons = mergeWeaponCollections(pgcrQuery.data?.players.map(p => p.weapons) ?? [])
        return {
            isLoading: false,
            raid: activityQuery.data?.meta.raid ?? pgcrQuery.data!.meta?.raid ?? null,
            completed: activityQuery.data?.completed ?? pgcrQuery.data!.completed,
            hash: activityQuery.data?.raidHash
                ? Number(activityQuery.data.raidHash)
                : undefined ?? pgcrQuery.data!.hash,
            completionDate: activityQuery.data?.dateCompleted
                ? new Date(activityQuery.data.dateCompleted)
                : null ?? pgcrQuery.data!.completionDate,
            duration: activityQuery.data?.duration ?? pgcrQuery.data!.duration,
            activity: activityQuery.data,
            fresh: activityQuery.data?.fresh,
            ...(pgcrQuery.isSuccess
                ? {
                      isPGCRLoading: false,

                      weapons,
                      pgcrPlayers: pgcrQuery.data.players,
                      weightedScores: pgcrQuery.data.players.mapValues(
                          p => p.score / pgcrQuery.data.players.size
                      ),
                      stats: {
                          mostUsedWeaponHash: weapons.firstKey(),
                          kills: pgcrQuery.data.players.reduce((acc, p) => acc + p.values.kills, 0),
                          deaths: pgcrQuery.data.players.reduce(
                              (acc, p) => acc + p.values.deaths,
                              0
                          ),
                          assists: pgcrQuery.data.players.reduce(
                              (acc, p) => acc + p.values.assists,
                              0
                          ),
                          abilityKills: pgcrQuery.data.players.reduce(
                              (acc, p) => acc + p.values.abilityKills,
                              0
                          ),
                          superKills: pgcrQuery.data.players.reduce(
                              (acc, p) => acc + p.values.superKills,
                              0
                          ),
                          overallKD:
                              pgcrQuery.data.players.reduce((acc, p) => acc + p.values.kills, 0) /
                              (pgcrQuery.data.players.reduce(
                                  (acc, p) => acc + p.values.deaths,
                                  0
                              ) || 1),
                          charactersUsed: pgcrQuery.data.entryLength,
                          mvp: pgcrQuery.data.completed ? pgcrQuery.data.players.first()! : null
                      }
                  }
                : {
                      isPGCRLoading: true,
                      pgcrPlayers: undefined,
                      weightedScores: undefined,
                      stats: undefined,
                      weapons: undefined
                  })
        }
    }, [
        activityQuery.data,
        activityQuery.isSuccess,
        pgcrQuery.data,
        pgcrQuery.isLoading,
        pgcrQuery.isSuccess
    ])

    return <PGCRContext.Provider value={ctxValue}>{children}</PGCRContext.Provider>
}
