import { RaidHubAPIResponse, RaidHubPlayer, RaidHubPlayerResponse } from "~/types/raidhub-api"
import { getRaidHubBaseUrl } from "~/util/raidhub/getRaidHubUrl"
import { createHeaders } from "./createHeaders"

export function getRaidHubMemberQueryKey(membershipId: string) {
    return ["raidhub-member", membershipId] as const
}
export async function getRaidHubMember(membershipId: string) {
    const url = new URL(getRaidHubBaseUrl() + `/member/${membershipId}`)

    const res = await fetch(url, { headers: createHeaders() })

    const data = (await res.json()) as RaidHubAPIResponse<
        Omit<RaidHubPlayer, "clears" | "sherpas" | "lowmanSherpas">
    >
    if (data.success) {
        return data.response
    } else {
        throw new Error(data.message)
    }
}
