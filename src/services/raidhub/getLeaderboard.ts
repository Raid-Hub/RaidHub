import { LeaderboardResponse } from "~/types/leaderboards"
import {
    RaidHubAPIResponse,
    RaidHubActivityLeaderboardResponse,
    RaidHubIndividualLeaderboardResponse
} from "~/types/raidhub-api"
import { ListedRaid } from "~/types/raids"
import { bungieIconUrl } from "~/util/destiny/bungie-icons"
import { RaidToUrlPaths } from "~/util/destiny/raidUtils"
import { getRaidHubBaseUrl } from "~/util/raidhub/getRaidHubUrl"
import { createHeaders } from "./createHeaders"

export enum Leaderboard {
    WorldFirst = "worldfirst",
    Sherpa = "sherpas",
    FullClears = "fresh",
    Clears = "clears",
    Trios = "trios",
    Duos = "duos",
    Solos = "solos"
}

export function leaderboardQueryKey(
    raid: ListedRaid | "global",
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
    url.searchParams.append("page", String(page))
    url.searchParams.append("count", "50")

    try {
        const res = await fetch(url, { headers: createHeaders() })

        const data = (await res.json()) as RaidHubAPIResponse<RaidHubActivityLeaderboardResponse>

        if (data.success) {
            return {
                date: data.response.date ?? null,
                entries: data.response.entries.map(e => ({
                    id: e.instanceId,
                    rank: e.rank,
                    url: `/pgcr/${e.instanceId}`,
                    participants: e.players
                        .filter(p => p.didPlayerFinish)
                        .map(p => ({
                            id: p.membershipId,
                            iconURL: bungieIconUrl(p.iconPath),
                            displayName: p.bungieGlobalDisplayName || p.displayName,
                            url: `/profile/${p.membershipType}/${p.membershipId}`
                        })),
                    timeInSeconds:
                        (new Date(e.dateCompleted).getTime() -
                            new Date(data.response.date ?? e.dateStarted).getTime()) /
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

export async function getIndividualLeaderboard(raid: ListedRaid, board: Leaderboard, page: number) {
    const url = new URL(
        getRaidHubBaseUrl() + `/leaderboard/${RaidToUrlPaths[raid]}/individual/${board}`
    )
    url.searchParams.append("page", String(page))
    url.searchParams.append("count", "50")

    const res = await fetch(url, { headers: createHeaders() })

    const data = (await res.json()) as RaidHubAPIResponse<RaidHubIndividualLeaderboardResponse>

    if (data.success) {
        return data.response.entries
    } else {
        const err = new Error(data.message)
        Object.assign(err, data.error)
        throw err
    }
}

export async function getIndividualGlobalLeaderboard(
    board: Leaderboard.Clears | Leaderboard.Sherpa | Leaderboard.FullClears,
    page: number
) {
    const url = new URL(getRaidHubBaseUrl() + `/leaderboard/global/${board}`)
    url.searchParams.append("page", String(page))
    url.searchParams.append("count", "50")

    try {
        const res = await fetch(url, { headers: createHeaders() })

        const data = (await res.json()) as RaidHubAPIResponse<RaidHubIndividualLeaderboardResponse>

        if (data.success) {
            return data.response.entries
        } else {
            throw new Error(data.message)
        }
    } catch (e) {
        return []
    }
}
