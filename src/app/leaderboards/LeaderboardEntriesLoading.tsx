"use client"

import { usePageProps } from "~/components/layout/PageWrapper"
import { type PageProps } from "./Leaderboard"
import { LeaderboardEntries } from "./LeaderboardEntries"
import { usePage } from "./usePage"

export const LeaderboardEntriesLoading = () => {
    const page = usePage()
    const { count, type } = usePageProps<PageProps>()

    return (
        <LeaderboardEntries
            entries={Array.from({ length: count }, (_, idx) => ({
                position: (page - 1) * count + idx + 1,
                rank: (page - 1) * count + idx + 1,
                value: 0,
                id: idx,
                ...(type === "player"
                    ? {
                          type: "player",
                          player: {
                              id: "0",
                              displayName: "Loading..."
                          }
                      }
                    : {
                          type: "team",
                          team: Array.from({ length: 6 }, (_, idx) => ({
                              id: String(idx),
                              displayName: "Loading..."
                          }))
                      })
            }))}
        />
    )
}
