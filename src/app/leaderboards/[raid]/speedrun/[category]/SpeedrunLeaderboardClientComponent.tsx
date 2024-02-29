"use client"

import { useQuery } from "@tanstack/react-query"
import { RTABoardCategory } from "~/data/speedrun-com-mappings"
import { getSpeedrunComLeaderboard } from "~/services/speedrun-com/getSpeedrunComLeaderboard"
import { ListedRaid } from "~/types/raidhub-api"
import { SpeedrunLeaderboardResponse } from "~/types/speedrun-com"
import { Leaderboard } from "../../../Leaderboard"
import { LeaderboardEntries, type LeaderboardEntry } from "../../../LeaderboardEntries"

export const SpeedrunLeaderboardClientComponent = (props: {
    lastRevalidated: Date
    ssrData: SpeedrunLeaderboardResponse["data"] | null
    raid: ListedRaid
    category: RTABoardCategory
}) => {
    const { data: results } = useQuery({
        queryKey: ["speedrun-com", "leaderboard", props.raid, props.category] as const,
        queryFn: ({ queryKey }) =>
            getSpeedrunComLeaderboard({
                raid: queryKey[2],
                category: queryKey[3]
            }),
        staleTime: 30_000, // we can still serve the old data (revalidated every 2 hours), but let the client fetche new data
        initialDataUpdatedAt: props.lastRevalidated.getTime(),
        initialData: props.ssrData ?? undefined,
        select: (
            data
        ): (LeaderboardEntry & {
            type: "team"
        })[] => {
            const playersDict = new Map(data?.players.data.map(p => [p.id, p]))
            return (
                data?.runs.map(({ place, run }) => ({
                    type: "team",
                    rank: place,
                    value: run.times.primary_t,
                    id: run.id,
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
        <Leaderboard heading={<></>} pageProps={{}}>
            <LeaderboardEntries format="time" entries={results} />
        </Leaderboard>
    )
}
