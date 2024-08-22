import { useQuery } from "@tanstack/react-query"
import {
    type ClanStatsColumns,
    type RaidHubLeaderboardClanResponse
} from "~/services/raidhub/types"
import { getRaidHubApi } from "./common"

export const useClanStatsLeaderboard = ({
    column = "weighted_contest_score",
    page,
    count
}: {
    column?: ClanStatsColumns
    page: number
    count?: number
}) => {
    return useQuery<
        RaidHubLeaderboardClanResponse,
        Error,
        RaidHubLeaderboardClanResponse,
        ["raidhub", "leaderboard", "clan", ClanStatsColumns, number]
    >({
        queryKey: ["raidhub", "leaderboard", "clan", column, page],
        queryFn: ({ queryKey }) =>
            getRaidHubApi("/leaderboard/clan", null, {
                column: queryKey[3],
                page: queryKey[4],
                count
            }).then(res => res.response),
        staleTime: 300_000,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false
    })
}
