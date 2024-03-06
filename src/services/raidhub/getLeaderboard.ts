import type {
    ListedRaid,
    RaidHubGlobalLeaderboardCategory,
    RaidHubIndividualLeaderboardCategory,
    RaidHubRaidPath,
    RaidHubWorldFirstLeaderboardCategory
} from "~/services/raidhub/types"
import { getRaidHubApi } from "./common"

export function leaderboardQueryKey(
    raid: ListedRaid | "global",
    category:
        | RaidHubIndividualLeaderboardCategory
        | RaidHubWorldFirstLeaderboardCategory
        | RaidHubGlobalLeaderboardCategory,
    query: { page: number; count: number }
) {
    return ["raidhub-leaderboard", raid, category, query] as const
}

export async function getWorldfirstLeaderboard(args: {
    raid: RaidHubRaidPath
    category: RaidHubWorldFirstLeaderboardCategory
    page: number
    count: number
}) {
    return getRaidHubApi(
        "/leaderboard/{raid}/worldfirst/{category}",
        {
            category: args.category,
            raid: args.raid
        },
        {
            page: args.page,
            count: args.count
        }
    )
}

export async function getIndividualLeaderboard(args: {
    raid: RaidHubRaidPath
    category: RaidHubIndividualLeaderboardCategory
    page: number
    count: number
}) {
    const data = await getRaidHubApi(
        "/leaderboard/{raid}/individual/{category}",
        {
            category: args.category,
            raid: args.raid
        },
        {
            count: args.count,
            page: args.page
        }
    )

    return data
}

export async function getIndividualGlobalLeaderboard(args: {
    board: RaidHubGlobalLeaderboardCategory
    page: number
    count: number
}) {
    const data = await getRaidHubApi(
        "/leaderboard/global/{category}",
        {
            category: args.board
        },
        {
            count: args.count,
            page: args.page
        },
        {
            next: {
                revalidate: 3600
            }
        }
    )

    return data
}
