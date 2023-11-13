import { RaidHubAPIResponse, RaidHubPlayerResponse } from "~/types/raidhub-api"
import { getRaidHubBaseUrl } from "~/util/raidhub/getRaidHubUrl"
import { createHeaders } from "./createHeaders"
import { InitialProfileProps } from "~/types/profile"

export function postPlayerQueryKey(props: InitialProfileProps) {
    return ["raidhub-profileplayer-post", props] as const
}
export async function postPlayer(props: InitialProfileProps) {
    const url = new URL(getRaidHubBaseUrl() + `/player/log`)

    const body = {
        membershipId: props.destinyMembershipId,
        membershipType: props.destinyMembershipType
    }
    const res = await fetch(url, {
        method: "POST",
        headers: { ...createHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })

    const data = (await res.json()) as RaidHubAPIResponse<typeof body>
    if (data.success) {
        return data.response
    } else {
        throw new Error(data.message)
    }
}
