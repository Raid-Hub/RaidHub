import { LeaderboardResponse } from "~/types/leaderboards"
import { RaidHubAPIResponse, RaidHubActivityLeaderboardResponse } from "~/types/raidhub-api"
import { ListedRaid } from "~/types/raids"
import { bungieIconUrl } from "~/util/destiny/bungie-icons"
import { RaidToUrlPaths } from "~/util/destiny/raidUtils"
import { getRaidHubBaseUrl } from "~/util/raidhub/getRaidHubUrl"

export enum Leaderboard {
    WorldFirst = "worldfirst"
}

export function leaderboardQueryKey(
    raid: ListedRaid,
    board: Leaderboard,
    paramStrings: string[],
    page: number
) {
    return ["raidhub-leaderboard", raid, board, paramStrings, page] as const
}
export async function getLeaderboard(
    raid: ListedRaid,
    board: Leaderboard,
    params: string[],
    page: number
): Promise<LeaderboardResponse> {
    const url = new URL(
        getRaidHubBaseUrl() + `/leaderboard/${RaidToUrlPaths[raid]}/${board}/${params.join("/")}`
    )

    try {
        const res = await fetch(url)

        const data = (await res.json()) as RaidHubAPIResponse<RaidHubActivityLeaderboardResponse>

        if (data.success) {
            return {
                date: data.response.date ?? null,
                entries: data.response.entries.map(e => ({
                    id: e.activityId,
                    rank: e.rank,
                    url: `/pgcr/${e.activityId}`,
                    participants: e.players.map(p => ({
                        id: p.membershipId,
                        iconURL: bungieIconUrl(p.iconPath),
                        displayName: p.bungieGlobalDisplayName || p.displayName,
                        url: `/profile/${p.membershipType}/${p.membershipId}`
                    })),
                    timeInSeconds:
                        (new Date(e.dateCompleted).getTime() - new Date(e.dateStarted).getTime()) /
                        1000
                }))
            }
        } else {
            throw new Error(data.message)
        }
    } catch (e) {
        return {
            date: null,
            entries: []
        }
    }
}
