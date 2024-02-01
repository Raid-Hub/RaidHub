import { RaidHubLeaderboardSearchQuery } from "~/types/raidhub-api"
import { getRaidHubApi } from "."

export function searchLeaderboardPlayerMutationKey(
    query: Omit<RaidHubLeaderboardSearchQuery, "membershipId">
) {
    return ["raidhub-leaderboard-player", query] as const
}

export async function searchLeaderboardPlayer(
    query: Omit<RaidHubLeaderboardSearchQuery, "membershipId">,
    membershipId: string
) {
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
