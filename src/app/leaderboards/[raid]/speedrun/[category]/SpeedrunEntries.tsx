"use client"

import Image from "next/image"
import { LeaderboardEntriesLoadingWrapper } from "~/app/leaderboards/LeaderboardEntriesLoadingWrapper"
import { useLeaderboard } from "~/app/leaderboards/useLeaderboard"
import { SpeedrunPlacementIcons, type RTABoardCategory } from "~/data/speedrun-com-mappings"
import type { ListedRaid } from "~/services/raidhub/types"
import { getSpeedrunComLeaderboard } from "~/services/speedrun-com/getSpeedrunComLeaderboard"
import { type SpeedrunLeaderboardResponse } from "~/types/speedrun-com"
import { o } from "~/util/o"
import { type LeaderboardEntry } from "../../../LeaderboardEntries"

export const SpeedrunEntries = (props: {
    lastRevalidated: number
    ssrData: SpeedrunLeaderboardResponse["data"] | null
    raid: ListedRaid
    category?: RTABoardCategory
}) => {
    const query = useLeaderboard({
        queryKey: ["speedrun-com", "leaderboard", props.raid, props.category] as const,
        queryFn: ({ queryKey }) =>
            getSpeedrunComLeaderboard({
                raid: queryKey[2],
                category: queryKey[3]
            }),
        initialDataUpdatedAt: props.lastRevalidated,
        initialData: props.ssrData ?? undefined,
        select: (
            data
        ): Extract<
            LeaderboardEntry,
            {
                type: "team"
            }
        >[] => {
            const playersDict = new Map(data?.players.data.map(p => [p.id, p]))
            return (
                data?.runs.map(({ place, run }) => ({
                    type: "team",
                    rank: place,
                    value: run.times.primary_t,
                    position: place,
                    url: run.weblink,
                    team: run.players.map(player => {
                        if (player.rel === "guest") {
                            return {
                                id: player.name,
                                displayName: player.name
                            }
                        }
                        const playerData = playersDict.get(player.id)!
                        return {
                            id: player.id,
                            displayName: playerData.names.international,
                            iconUrl: playerData.assets?.image?.uri ?? undefined,
                            url: playerData.weblink
                        }
                    })
                })) ?? []
            )
        }
    })

    return (
        <LeaderboardEntriesLoadingWrapper
            {...query}
            icons={o.mapValues(SpeedrunPlacementIcons.variants, (place, path) => (
                <Image
                    alt={place}
                    src={SpeedrunPlacementIcons.base + path}
                    unoptimized
                    width={30}
                    height={30}
                />
            ))}
        />
    )
}
