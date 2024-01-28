import { RaidHubAPIResponse, RaidHubActivityResponse } from "~/types/raidhub-api"
import { getRaidHubBaseUrl } from "~/util/raidhub/getRaidHubUrl"
import { createHeaders } from "."

export function activityQueryKey(activityId: string) {
    return ["raidhub-activity", activityId] as const
}
export async function getActivity(activityId: string) {
    const url = new URL(getRaidHubBaseUrl() + `/activity/${activityId}`)

    const res = await fetch(url, { headers: { ...createHeaders() } })

    const data = (await res.json()) as RaidHubAPIResponse<
        RaidHubActivityResponse,
        { notFound: true; instanceId: string }
    >

    if (data.success) {
        return data.response
    } else {
        const err = new Error(data.message)
        Object.assign(err, data.error)
        throw err
    }
}
