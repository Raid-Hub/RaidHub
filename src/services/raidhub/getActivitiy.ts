import { getRaidHubApi } from "."

export function activityQueryKey(activityId: string) {
    return ["raidhub-activity", activityId] as const
}
export async function getActivity(activityId: string) {
    return getRaidHubApi("/activity/{instanceId}", { instanceId: activityId }, null)
}
