import { Collection } from "@discordjs/collection"
import {
    type RaidHubActivityExtended,
    type RaidHubActivitySearchQuery
} from "~/services/raidhub/types"
import { postRaidHubApi } from "./common"

export function activitySearchQueryKey(query: RaidHubActivitySearchQuery) {
    return ["raidhub-activity-search", query] as const
}

export async function activitySearch(
    body: RaidHubActivitySearchQuery
): Promise<Collection<string, RaidHubActivityExtended>> {
    const data = await postRaidHubApi("/activity/search", null, body).then(res => res.response)
    return new Collection(data.results.map(r => [r.instanceId, r]))
}
