import Activity from "~/models/profile/data/Activity"
import { RaidHubAPIResponse, RaidHubActivitiesResponse } from "~/types/raidhub-api"
import { getRaidHubBaseUrl } from "~/util/raidhub/getRaidHubUrl"
import { createHeaders } from "./createHeaders"

export function activitiesQueryKey(membershipId: string) {
    return ["raidhub-player-activities", membershipId] as const
}
export async function getAllActivities(membershipId: string) {
    const all = new Array<Activity>()
    let cursor = undefined
    do {
        const data = await getActivities({ membershipId, cursor })
        all.push(...data.activities.map(a => new Activity(a)))
        cursor = data.nextCursor
    } while (cursor)

    return all
}

async function getActivities({
    membershipId,
    cursor
}: {
    membershipId: string
    cursor?: string
}): Promise<RaidHubActivitiesResponse> {
    const url = new URL(getRaidHubBaseUrl() + `/player/${membershipId}/activities`)

    if (cursor) {
        url.searchParams.set("cursor", cursor)
    }

    const res = await fetch(url, { headers: createHeaders() })

    const data = (await res.json()) as RaidHubAPIResponse<RaidHubActivitiesResponse>

    if (data.success) {
        return data.response
    } else {
        const err = new Error(data.message)
        Object.assign(err, data.error)
        throw err
    }
}
