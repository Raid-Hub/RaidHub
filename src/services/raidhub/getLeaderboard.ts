import { LeaderboardResponse } from "~/types/leaderboards"
import {
    ListedRaid,
    RaidHubGlobalLeaderboardCategory,
    RaidHubIndividualLeaderboardCategory,
    RaidHubRaidPath,
    RaidHubWorldFirstLeaderboardCategory
} from "~/types/raidhub-api"
import { bungieIconUrl } from "~/util/destiny/bungie-icons"
import { getRaidHubApi } from "."

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
}): Promise<LeaderboardResponse> {
    try {
        const data = await getRaidHubApi(
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

        return {
            date: data.date ? new Date(data.date) : null,
            entries: data.entries.map(e => ({
                id: e.activity.instanceId,
                rank: e.rank,
                url: `/pgcr/${e.activity.instanceId}`,
                participants: e.players
                    .filter(p => p.data.finishedRaid)
                    .map(p => ({
                        id: p.membershipId,
                        iconURL: bungieIconUrl(p.iconPath),
                        displayName: p.bungieGlobalDisplayName || p.displayName || p.membershipId,
                        url: `/profile/${p.membershipType || 0}/${p.membershipId}`
                    })),
                timeInSeconds: e.value
            }))
        }
    } catch (e) {
        return {
            date: null,
            entries: []
        }
    }
}

export async function getIndividualLeaderboard(args: {
    raid: RaidHubRaidPath
    board: RaidHubIndividualLeaderboardCategory
    page: number
    count: number
}) {
    const data = await getRaidHubApi(
        "/leaderboard/{raid}/individual/{category}",
        {
            category: args.board,
            raid: args.raid
        },
        {
            count: args.count,
            page: args.page
        }
    )

    return data.entries
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
        }
    )

    return data.entries
}
