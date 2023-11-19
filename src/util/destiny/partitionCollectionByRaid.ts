import { Collection } from "@discordjs/collection"
import Activity from "~/models/profile/data/Activity"
import { ListedRaid } from "~/types/raids"

export function partitionCollectionByRaid(
    collection: Iterable<[string, Activity]>,
    hashFn: (item: Activity) => ListedRaid
) {
    const map = new Collection<ListedRaid, Collection<string, Activity>>()
    for (const [key, data] of Array.from(collection)) {
        const raid = hashFn(data)
        if (map.has(raid)) {
            map.get(raid)!.set(key, data)
        } else {
            map.set(raid, new Collection([[key, data]]))
        }
    }
    return map.each(coll => coll.sort((a, b) => b.dateStarted.getTime() - a.dateStarted.getTime()))
}
