"use client"

import { useQuery } from "@tanstack/react-query"
import { ReactNode, createContext, useContext, useMemo } from "react"
import { getRaidHubApi } from "~/services/raidhub"
import {
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
    getUrlPathForRaid(raid: ListedRaid): RaidHubRaidPath
    getDifficultyString(
        raid: RaidDifficulty
    ): RaidHubManifestResponse["difficultyStrings"][RaidDifficulty]
    getRaidString(raid: ListedRaid): RaidHubManifestResponse["raidStrings"][ListedRaid]
    getRaidFromHash: (hash: string | number) => {
        raid: ListedRaid
        difficulty: RaidDifficulty
    } | null
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

    const value: ManifestContextData = useMemo(() => {
        return {
            getRaidString: (raid: ListedRaid) => data.raidStrings[raid],
            getDifficultyString: (raid: RaidDifficulty) => data.difficultyStrings[raid],
            getUrlPathForRaid: (raid: ListedRaid) => data.raidUrlPaths[raid],
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
            sunsetRaids: [...data.sunset]
        }
    }, [data])

    return <ManifestContext.Provider value={value}>{props.children}</ManifestContext.Provider>
}

export function useRaidHubManifest() {
    const manifest = useContext(ManifestContext)
    if (manifest === undefined)
        throw new Error("Cannot use RaidHub manifest context outside of the provider")

    return manifest
}
