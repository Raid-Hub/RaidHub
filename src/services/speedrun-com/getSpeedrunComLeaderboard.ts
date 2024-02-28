import {
    SpeedrunBoardId,
    SpeedrunVariables,
    destiny2GameId,
    type RTABoardCategory
} from "~/data/speedrun-com-mappings"
import type { ListedRaid } from "~/types/raidhub-api"
import type { SpeedrunLeaderboardResponse } from "~/types/speedrun-com"

export async function getSpeedrunComLeaderboard(
    params: {
        raid: ListedRaid
        category?: RTABoardCategory
    },
    init: Omit<RequestInit, "method"> = {}
) {
    const boardId = SpeedrunBoardId[params.raid]
    if (!boardId) {
        return []
    }

    const url = new URL(
        `/api/v1/leaderboards/${destiny2GameId}/category/${boardId}`,
        "https://www.speedrun.com"
    )
    url.searchParams.append("embed", "players")

    const mappings = SpeedrunVariables[params.raid]

    if (mappings && typeof params.category === "string" && params.category !== "all") {
        const key = `var-${mappings.variable}`
        const value = mappings.values[params.category]?.id
        if (!value) throw new Error(`Invalid static category: ${params.category}`)

        url.searchParams.append(key, value)
    }

    const res = await fetch(url, {
        method: "GET",
        ...init
    })

    if (res.ok) {
        const { data } = (await res.json()) as SpeedrunLeaderboardResponse
        return data
    } else {
        throw new Error(
            "Invalid Speedrun.com response. Status: " + res.status + " " + res.statusText
        )
    }
}
