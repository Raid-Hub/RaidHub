"use client"

import { usePageProps } from "~/components/layout/PageWrapper"
import { getIndividualLeaderboard } from "~/services/raidhub/getLeaderboard"
import type {
    RaidHubIndividualLeaderboardCategory,
    RaidHubIndividualLeaderboardResponse,
    RaidHubRaidPath
} from "~/services/raidhub/types"
import { bungieProfileIconUrl, getBungieDisplayName } from "~/util/destiny"
import { type PageProps } from "../../Leaderboard"
import { LeaderboardEntriesLoadingWrapper } from "../../LeaderboardEntriesLoadingWrapper"
import { useLeaderboard } from "../../useLeaderboard"
import { usePage } from "../../usePage"
import { createQueryKey } from "./constants"

export const IndividualEntries = (props: {
    ssr?: RaidHubIndividualLeaderboardResponse
    ssrUpdatedAt: number
    ssrPage: string
    raidPath: RaidHubRaidPath
    category: RaidHubIndividualLeaderboardCategory
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
            getIndividualLeaderboard({
                raid: queryKey[3],
                category: queryKey[4],
                page: queryKey[5],
                count: count
            }),
        select: data =>
            data?.entries.map(entry => ({
                type: "player",
                rank: entry.rank,
                value: entry.value,
                position: entry.position,
                player: {
                    id: entry.player.membershipId,
                    displayName: getBungieDisplayName(entry.player),
                    iconUrl: bungieProfileIconUrl(entry.player.iconPath),
                    url: `/profile/${entry.player.membershipId}`
                }
            }))
    })

    return <LeaderboardEntriesLoadingWrapper {...query} />
}
