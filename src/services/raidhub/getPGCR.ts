import { getRaidHubApi } from "."

export function pgcrQueryKey(instanceId: string) {
    return ["raidhub-pgcr", instanceId] as const
}
export async function getRaidHubPGCR(instanceId: string) {
    return getRaidHubApi("/pgcr/{instanceId}", { instanceId }, null)
}
