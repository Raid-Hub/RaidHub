"use client"

import { usePageProps } from "~/components/layout/PageWrapper"
import type { RaidHubPantheonFirstResponse, RaidHubPantheonPath } from "~/services/raidhub/types"
import { bungieProfileIconUrl, getBungieDisplayName } from "~/util/destiny"
import { type PageProps } from "../../Leaderboard"
import { LeaderboardEntriesLoadingWrapper } from "../../LeaderboardEntriesLoadingWrapper"
import { useLeaderboard } from "../../useLeaderboard"
import { usePage } from "../../usePage"
import { createTeamQueryKey, getTeamLeaderboard } from "../common"

export const TeamEntries = (props: {
    ssr?: RaidHubPantheonFirstResponse
    ssrUpdatedAt: number
    ssrPage: string
    category: "first" | "speedrun" | "score"
    pantheonPath: RaidHubPantheonPath
}) => {
    const page = usePage()
    const { count } = usePageProps<PageProps>()

    const query = useLeaderboard({
        // The SSR page may not be the same as the current page, so we need to check
        initialData: props.ssrPage === String(page) ? props.ssr : undefined,
        initialDataUpdatedAt: props.ssrUpdatedAt,
        queryKey: createTeamQueryKey({
            category: props.category,
            pantheonPath: props.pantheonPath,
            page,
            count
        }),
        queryFn: ({ queryKey }) =>
            getTeamLeaderboard({
                version: queryKey[1],
                category: queryKey[2],
                count: queryKey[3],
                page: queryKey[4]
            }).then(res => res.response),
        select: data =>
            data?.entries.map(entry => ({
                type: "team",
                rank: entry.rank,
                value: entry.value,
                position: entry.position,
                url: `/pgcr/${entry.activity.instanceId}`,
                team: entry.players
                    .filter(p => p.data.completed)
                    .map(player => ({
                        id: player.player.membershipId,
                        displayName: getBungieDisplayName(player.player),
                        iconUrl: bungieProfileIconUrl(player.player.iconPath),
                        url: `/profile/${player.player.membershipId}`
                    }))
            }))
    })

    return <LeaderboardEntriesLoadingWrapper {...query} />
}
