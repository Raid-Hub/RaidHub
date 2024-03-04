"use client"

import { usePageProps } from "~/components/layout/PageWrapper"
import { getWorldfirstLeaderboard } from "~/services/raidhub/getLeaderboard"
import type {
    RaidHubRaidPath,
    RaidHubWorldFirstLeaderboardCategory,
    RaidHubWorldfirstLeaderboardResponse
} from "~/services/raidhub/types"
import { bungieProfileIconUrl, getBungieDisplayName } from "~/util/destiny"
import { type PageProps } from "../../../Leaderboard"
import { LeaderboardEntriesLoadingWrapper } from "../../../LeaderboardEntriesLoadingWrapper"
import { useLeaderboard } from "../../../useLeaderboard"
import { usePage } from "../../../usePage"
import { createQueryKey } from "./constants"

export const WorldfirstEntries = (props: {
    ssr?: RaidHubWorldfirstLeaderboardResponse
    ssrUpdatedAt: number
    ssrPage: string
    raidPath: RaidHubRaidPath
    category: RaidHubWorldFirstLeaderboardCategory
}) => {
    const page = usePage()
    const { count } = usePageProps<PageProps>()

    const query = useLeaderboard({
        // The SSR page may not be the same as the current page, so we need to check
        initialData: props.ssrPage === String(page) ? props.ssr : undefined,
        initialDataUpdatedAt: props.ssrUpdatedAt,
        queryKey: createQueryKey({
            raidPath: props.raidPath,
            category: props.category,
            page
        }),
        queryFn: ({ queryKey }) =>
            getWorldfirstLeaderboard({
                raid: queryKey[3],
                category: queryKey[4],
                page: queryKey[5],
                count: count
            }),
        select: data =>
            data?.entries.map(entry => ({
                type: "team",
                rank: entry.rank,
                value: entry.value,
                position: entry.position,
                url: `/pgcr/${entry.activity.instanceId}`,
                team: entry.players
                    .filter(p => p.data.finishedRaid)
                    .map(player => ({
                        id: player.membershipId,
                        displayName: getBungieDisplayName(player),
                        iconUrl: bungieProfileIconUrl(player.iconPath),
                        url: player.membershipType
                            ? `/profile/${player.membershipType}/${player.membershipId}`
                            : undefined
                    }))
            }))
    })

    return <LeaderboardEntriesLoadingWrapper {...query} />
}
