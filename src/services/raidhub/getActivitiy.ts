import { RaidHubAPIResponse, RaidHubActivityResponse } from "~/types/raidhub-api"
import { getRaidHubBaseUrl } from "~/util/raidhub/getRaidHubUrl"

export function activityQueryKey(activityId: string) {
    return ["raidhub-activity", activityId] as const
}
export async function getActivity(activityId: string) {
    const url = new URL(getRaidHubBaseUrl() + `/activity/${activityId}`)

    const res = await fetch(url)

    const data = (await res.json()) as RaidHubAPIResponse<RaidHubActivityResponse>

    if (data.success) {
        return data.response
    } else {
        throw new Error(data.message)
    }
}
