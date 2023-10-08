import { LeaderboardMeta } from "~/types/leaderboards"
import { ListedRaid } from "~/types/raids"

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
): Promise<LeaderboardMeta> {
    console.log(raid, params, page)

    // todo: implement raidhub leaderboard query
    return {
        entries: []
    }
}
