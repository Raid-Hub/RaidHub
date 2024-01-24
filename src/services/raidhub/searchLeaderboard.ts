import { RaidHubLeaderboardSearchResult } from "~/types/raidhub-api"
import { ListedRaid } from "~/types/raids"
import { Leaderboard } from "./getLeaderboard"

type LeaderboardSearchParams =
    | {
          type: "global"
          board:
              | Leaderboard.Clears
              | Leaderboard.Sherpa
              | Leaderboard.FullClears
              | Leaderboard.Speedrun
      }
    | {
          type: "invidual"
          board: Leaderboard
          raid: ListedRaid
      }
    | {
          type: "worldfirst"
          board: Leaderboard
          raid: ListedRaid
          params: string[]
      }

type LeaderboardSearchQueryParams = {
    page: number
    count: number
}

export function searchLeaderboardPlayerQueryKey(
    params: LeaderboardSearchParams,
    query: LeaderboardSearchQueryParams
) {
    return ["raidhub-leaderboard-player", params, query] as const
}

export async function searchLeaderboardPlayer(
    params: LeaderboardSearchParams,
    query: LeaderboardSearchQueryParams,
    membershipId: string
): Promise<RaidHubLeaderboardSearchResult> {
    // const url = new URL(getRaidHubBaseUrl() + `/player/search`)
    // url.searchParams.append("query", query)

    const pos = Math.ceil(Math.random() * 10000)
    return new Promise(resolve =>
        setTimeout(
            () =>
                resolve({
                    position: pos,
                    page: Math.floor(pos / query.count) + 1,
                    entries: []
                }),
            1000
        )
    )
}
