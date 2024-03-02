"use client"

import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { z } from "zod"
import { getIndividualGlobalLeaderboard } from "~/services/raidhub/getLeaderboard"
import type {
    RaidHubGlobalLeaderboardCategory,
    RaidHubGlobalLeaderboardResponse
} from "~/types/raidhub-api"
import { bungieProfileIconUrl } from "~/util/destiny/bungie-icons"
import { getUserName } from "~/util/destiny/bungieName"
import { LeaderboardEntries, type LeaderboardEntry } from "../../LeaderboardEntries"
import { ENTRIES_PER_PAGE } from "./constants"

export const GlobalEntriesClient = (props: {
    lastRevalidated: Date
    ssrData: RaidHubGlobalLeaderboardResponse | null
    category: RaidHubGlobalLeaderboardCategory
}) => {
    const searchParams = useSearchParams()
    const pageParsed = z.number().int().positive().default(1).safeParse(searchParams.get("page"))
    const page = pageParsed.success ? pageParsed.data : 1
    const { data: results } = useQuery({
        suspense: true,
        queryKey: [
            "raidhub",
            "leaderboard",
            "global",
            props.category,
            page,
            ENTRIES_PER_PAGE
        ] as const,
        queryFn: ({ queryKey }) =>
            getIndividualGlobalLeaderboard(
                {
                    board: queryKey[3],
                    page: queryKey[4],
                    count: queryKey[5]
                },
                {
                    next: {
                        revalidate: 3600
                    }
                }
            ),
        staleTime: 30_000, // we can still serve the old data (revalidated every 2 hours), but let the client fetche new data
        initialDataUpdatedAt: props.lastRevalidated.getTime(),
        initialData: props.ssrData ?? undefined,
        select: (
            data
        ): Extract<
            LeaderboardEntry,
            {
                type: "player"
            }
        >[] =>
            data?.entries.map(entry => ({
                type: "player",
                rank: entry.rank,
                value: entry.value,
                id: entry.position,
                player: {
                    id: entry.player.membershipId,
                    displayName: getUserName(entry.player),
                    iconUrl: bungieProfileIconUrl(entry.player.iconPath),
                    url: entry.player.membershipType
                        ? `/profile/${entry.player.membershipType}/${entry.player.membershipId}`
                        : undefined
                }
            })) ?? []
    })

    return <LeaderboardEntries entries={results} />
}
