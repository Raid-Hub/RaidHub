import { LeaderboardMeta } from "../../types/leaderboards"
import { ListedRaid } from "~/types/raids"

export const wfKey = "worldfirst"
export function leaderbordQueryKey(raid: ListedRaid, paramStrings: string[], page: number) {
    return ["leaderboard", raid, paramStrings, page] as const
}
export async function getLeaderboard(
    raid: ListedRaid,
    params: string[],
    page: number
): Promise<LeaderboardMeta> {
    console.log(raid, params, page)
    return {
        entries: []
    }
}
