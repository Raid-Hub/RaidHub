import { Collection } from "@discordjs/collection"
import { ListedRaid } from "~/types/raids"

export function partitionCollectionByRaid<T>(
    collection: Iterable<[string, T]>,
    hashFn: (item: T) => ListedRaid
) {
    const map = new Collection<ListedRaid, Collection<string, T>>()
    for (const [key, data] of Array.from(collection)) {
        const raid = hashFn(data)
        if (map.has(raid)) {
            map.get(raid)!.set(key, data)
        } else {
            map.set(raid, new Collection([[key, data]]))
        }
    }
    return map
}
