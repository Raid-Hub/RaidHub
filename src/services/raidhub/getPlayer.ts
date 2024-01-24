import { RaidHubAPIResponse, RaidHubPlayer, RaidHubPlayerResponse } from "~/types/raidhub-api"
import { getRaidHubBaseUrl } from "~/util/raidhub/getRaidHubUrl"
import { createHeaders } from "./_createHeaders"

export function playerQueryKey(membershipId: string) {
    return ["raidhub-player", membershipId] as const
}
export async function getPlayer(membershipId: string) {
    const url = new URL(getRaidHubBaseUrl() + `/player/${membershipId}/profile`)

    const res = await fetch(url, { headers: createHeaders() })

    const data = (await res.json()) as RaidHubAPIResponse<RaidHubPlayerResponse>
    if (data.success) {
        return data.response
    } else {
        const err = new Error(data.message)
        Object.assign(err, data.error)
        throw err
    }
}

export function getPlayerBasicKey(membershipId: string) {
    return ["raidhub-player-basic", membershipId] as const
}
export async function getPlayerBasic(membershipId: string) {
    const url = new URL(getRaidHubBaseUrl() + `/player/${membershipId}/basic`)

    const res = await fetch(url, { headers: createHeaders() })

    const data = (await res.json()) as RaidHubAPIResponse<
        Omit<RaidHubPlayer, "clears" | "sherpas" | "fullClears">
    >
    if (data.success) {
        return data.response
    } else {
        throw new Error(data.message)
    }
}
