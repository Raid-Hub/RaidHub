"use client"

import { usePageProps } from "~/components/layout/PageWrapper"
import { getIndividualGlobalLeaderboard } from "~/services/raidhub/getLeaderboard"
import type {
    RaidHubGlobalLeaderboardCategory,
    RaidHubGlobalLeaderboardResponse
} from "~/services/raidhub/types"
import { bungieProfileIconUrl } from "~/util/destiny"
import { getBungieDisplayName } from "~/util/destiny/getBungieDisplayName"
import { type PageProps } from "../../Leaderboard"
import { LeaderboardEntriesLoadingWrapper } from "../../LeaderboardEntriesLoadingWrapper"
import { useLeaderboard } from "../../useLeaderboard"
import { usePage } from "../../usePage"
import { createQueryKey } from "./constants"

export const GlobalEntries = (props: {
    ssr?: RaidHubGlobalLeaderboardResponse
    ssrUpdatedAt: number
    ssrPage: string
    category: RaidHubGlobalLeaderboardCategory
}) => {
    const page = usePage()
    const { count } = usePageProps<PageProps>()

    const query = useLeaderboard({
        // The SSR page may not be the same as the current page, so we need to check
        initialData: props.ssrPage === String(page) ? props.ssr : undefined,
        initialDataUpdatedAt: props.ssrUpdatedAt,
        queryKey: createQueryKey({
            category: props.category,
            page
        }),
        queryFn: ({ queryKey }) =>
            getIndividualGlobalLeaderboard({
                board: queryKey[3],
                page: queryKey[4],
                count: count
            }),
        select: data =>
            data?.entries.map(entry => ({
                type: "player",
                rank: entry.rank,
                value: entry.value,
                id: entry.position,
                player: {
                    id: entry.player.membershipId,
                    displayName: getBungieDisplayName(entry.player),
                    iconUrl: bungieProfileIconUrl(entry.player.iconPath),
                    url: entry.player.membershipType
                        ? `/profile/${entry.player.membershipType}/${entry.player.membershipId}`
                        : undefined
                }
            }))
    })

    return <LeaderboardEntriesLoadingWrapper {...query} />
}
