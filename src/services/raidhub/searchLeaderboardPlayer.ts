"use client"

import type {
    RaidHubLeaderboardSearchQuery,
    RaidHubLeaderboardSearchResponse
} from "~/services/raidhub/types"
import { getRaidHubApi } from "./common"

export async function searchLeaderboardPlayer(
    query: Omit<RaidHubLeaderboardSearchQuery, "membershipId">,
    membershipId: string
): Promise<RaidHubLeaderboardSearchResponse> {
    switch (query.type) {
        case "global":
            return getRaidHubApi("/leaderboard/search", null, {
                type: query.type,
                membershipId: membershipId,
                count: query.count,
                category: query.category
            })
        case "individual":
            return getRaidHubApi("/leaderboard/search", null, {
                type: query.type,
                membershipId: membershipId,
                count: query.count,
                category: query.category,
                raid: query.raid
            })
        case "worldfirst":
            return getRaidHubApi("/leaderboard/search", null, {
                type: query.type,
                membershipId: membershipId,
                count: query.count,
                category: query.category,
                raid: query.raid
            })
    }
}
