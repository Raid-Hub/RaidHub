import { Collection } from "@discordjs/collection"
import { RaidHubActivityExtended, RaidHubActivitySearchQuery } from "~/types/raidhub-api"
import { getRaidHubApi } from "."

export function activitySearchQueryKey(query: RaidHubActivitySearchQuery) {
    return ["raidhub-activity-search", query] as const
}

export async function activitySearch(
    query: RaidHubActivitySearchQuery
): Promise<Collection<string, RaidHubActivityExtended>> {
    const data = await getRaidHubApi("/activity/search", null, query)
    return new Collection(data.results.map(r => [r.instanceId, r]))
}
