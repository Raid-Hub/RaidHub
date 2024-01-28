import { RaidHubAPIResponse, RaidHubLeaderboardSearchResult } from "~/types/raidhub-api"
import { ListedRaid } from "~/types/raids"
import { Leaderboard } from "./getLeaderboard"
import { getRaidHubBaseUrl } from "~/util/raidhub/getRaidHubUrl"
import { createHeaders } from "."

type LeaderboardSearchParams<T extends "global" | "individual" | "worldfirst"> = T extends "global"
    ? {
          type: "global"
          board:
              | Leaderboard.Clears
              | Leaderboard.Sherpa
              | Leaderboard.FullClears
              | Leaderboard.Speedrun
      }
    : T extends "individual"
    ? {
          type: T & "individual"
          board:
              | Leaderboard.Clears
              | Leaderboard.Sherpa
              | Leaderboard.FullClears
              | Leaderboard.Trios
              | Leaderboard.Duos
              | Leaderboard.Solos
          raid: ListedRaid
      }
    : {
          type: T & "worldfirst"
          raid: ListedRaid
          params: string[]
      }

type LeaderboardSearchQueryParams = {
    page: number
    count: number
}

export function searchLeaderboardPlayerQueryKey<T extends "global" | "individual" | "worldfirst">(
    params: LeaderboardSearchParams<T>,
    query: LeaderboardSearchQueryParams
) {
    return ["raidhub-leaderboard-player", params, query] as const
}

export async function searchLeaderboardPlayer<T extends "global" | "individual" | "worldfirst">(
    params: LeaderboardSearchParams<T>,
    query: LeaderboardSearchQueryParams,
    membershipId: string
): Promise<RaidHubLeaderboardSearchResult<T>> {
    const url = new URL(getRaidHubBaseUrl() + `/leaderboard/search`)
    url.searchParams.append("membershipId", membershipId)
    url.searchParams.append("count", String(query.count))
    url.searchParams.append("type", params.type)
    switch (params.type) {
        case "global":
            url.searchParams.append("category", params.board)
            break
        case "individual":
            url.searchParams.append("category", params.board)
            url.searchParams.append("raid", String(params.raid))
            break
        case "worldfirst":
            url.searchParams.append("raid", String(params.raid))
            url.searchParams.append("category", params.params[0])
            break
    }

    const res = await fetch(url, { headers: createHeaders() })

    const data = (await res.json()) as RaidHubAPIResponse<RaidHubLeaderboardSearchResult<T>>
    if (data.success) {
        return data.response
    } else {
        throw new Error(data.message)
    }
}
