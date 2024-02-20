"use client"

import { useQuery } from "@tanstack/react-query"
import { createContext, useContext, useMemo, type ReactNode } from "react"
import { getRaidHubApi } from "~/services/raidhub"
import type {
    ListedRaid,
    RaidDifficulty,
    RaidHubManifestResponse,
    RaidHubRaidPath,
    SunsetRaid
} from "~/types/raidhub-api"

type ManifestContextData = {
    leaderboards: RaidHubManifestResponse["leaderboards"]
    listedRaids: ListedRaid[]
    elevatedDifficulties: RaidDifficulty[]
    sunsetRaids: SunsetRaid[]
    reprisedRaids: RaidHubManifestResponse["reprisedChallengePairings"]
    getUrlPathForRaid(raid: ListedRaid): RaidHubRaidPath
    getDifficultyString(
        raid: RaidDifficulty
    ): RaidHubManifestResponse["difficultyStrings"][RaidDifficulty]
    getRaidString(raid: ListedRaid): RaidHubManifestResponse["raidStrings"][ListedRaid]
    getRaidFromHash: (hash: string | number) => {
        raid: ListedRaid
        difficulty: RaidDifficulty
    } | null
    getCheckpointName(raid: ListedRaid): RaidHubManifestResponse["checkpointNames"][ListedRaid]
}

const ManifestContext = createContext<ManifestContextData | undefined>(undefined)

export function RaidHubManifestManager(props: {
    children: ReactNode
    serverManifest: RaidHubManifestResponse
}) {
    const { data } = useQuery({
        queryKey: ["raidhub-manifest"],
        queryFn: () => getRaidHubApi("/manifest", null, null),
        initialData: props.serverManifest,
        staleTime: 1000 * 3600 // 1 hour
    })

    const value: ManifestContextData = useMemo(
        () => ({
            getRaidString: (raid: ListedRaid) => data.raidStrings[raid],
            getDifficultyString: (raid: RaidDifficulty) => data.difficultyStrings[raid],
            getUrlPathForRaid: (raid: ListedRaid) => data.raidUrlPaths[raid],
            getCheckpointName: (raid: ListedRaid) => data.checkpointNames[raid],
            getRaidFromHash: (hash: string | number) => {
                const raid = data.hashes[String(hash)]
                if (!raid) {
                    return null
                } else {
                    return {
                        raid: raid.raid as ListedRaid,
                        difficulty: raid.difficulty as RaidDifficulty
                    }
                }
            },
            elevatedDifficulties: Object.entries(data.difficultyStrings)
                .filter(([_, v]) => v === "Master" || v === "Prestige")
                .map(([k, _]) => Number(k) as RaidDifficulty),
            leaderboards: data.leaderboards,
            listedRaids: [...data.listed],
            sunsetRaids: [...data.sunset],
            reprisedRaids: data.reprisedChallengePairings
        }),
        [data]
    )

    return <ManifestContext.Provider value={value}>{props.children}</ManifestContext.Provider>
}

export function useRaidHubManifest() {
    const manifest = useContext(ManifestContext)
    if (manifest === undefined)
        throw new Error("Cannot use RaidHub manifest context outside of the provider")

    return manifest
}
