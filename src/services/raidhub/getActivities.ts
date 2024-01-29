import Activity from "~/models/profile/data/Activity"
import { RaidHubAPIResponse, RaidHubActivitiesResponse } from "~/types/raidhub-api"
import { getRaidHubApi } from "."

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
    const response = await getRaidHubApi(
        "/player/{membershipId}/activities",
        { membershipId },
        { cursor }
    )
    return response
}
