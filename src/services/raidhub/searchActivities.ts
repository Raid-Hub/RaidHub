import { Collection } from "@discordjs/collection"
import { RaidHubActivityExtended, RaidHubActivitySearchQuery } from "~/types/raidhub-api"
import { postRaidHubApi } from "."

export function activitySearchQueryKey(query: RaidHubActivitySearchQuery) {
    return ["raidhub-activity-search", query] as const
}

export async function activitySearch(
    body: RaidHubActivitySearchQuery
): Promise<Collection<string, RaidHubActivityExtended>> {
    const data = await postRaidHubApi("/activity/search", null, body)
    return new Collection(data.results.map(r => [r.instanceId, r]))
}
