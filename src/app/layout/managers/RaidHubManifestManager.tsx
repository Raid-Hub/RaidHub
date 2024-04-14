"use client"

import { useQuery } from "@tanstack/react-query"
import { createContext, useContext, useMemo, type ReactNode } from "react"
import { getRaidHubApi } from "~/services/raidhub/common"
import type {
    ListedRaid,
    PantheonId,
    RaidDifficulty,
    RaidHubManifestResponse,
    RaidHubRaidPath,
    SunsetRaid
} from "~/services/raidhub/types"
import { includedIn } from "~/util/helpers"

type ManifestContextData = {
    leaderboards: RaidHubManifestResponse["leaderboards"]
    listedRaids: ListedRaid[]
    elevatedRaidDifficulties: RaidDifficulty[]
    sunsetRaids: SunsetRaid[]
    reprisedRaids: RaidHubManifestResponse["reprisedChallengePairings"]
    getUrlPathForRaid(raid: ListedRaid): RaidHubRaidPath
    getDifficultyString(
        raid: RaidDifficulty
    ): RaidHubManifestResponse["versionStrings"][RaidDifficulty]
    getRaidString(
        raid: ListedRaid | PantheonId
    ): RaidHubManifestResponse["activityStrings"][ListedRaid]
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

    const value = useMemo(
        (): ManifestContextData => ({
            getRaidString: raid => data.activityStrings[raid],
            getDifficultyString: raid => data.versionStrings[raid],
            getUrlPathForRaid: raid => data.raidUrlPaths[raid],
            getCheckpointName: raid => data.checkpointNames[raid],
            getRaidFromHash: hash => {
                const raid = data.hashes[String(hash)]
                if (!raid || !includedIn(data.listed, raid.activityId)) {
                    return null
                } else {
                    return {
                        raid: raid.activityId as ListedRaid,
                        difficulty: raid.versionId as RaidDifficulty
                    }
                }
            },
            elevatedRaidDifficulties: Object.entries(data.versionStrings)
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
