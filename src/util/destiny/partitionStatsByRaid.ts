import { Collection } from "@discordjs/collection"
import {
    DestinyAggregateActivityResults,
    DestinyAggregateActivityStats
} from "bungie-net-core/models"
import { ListedRaid } from "~/types/raids"
import { raidTupleFromHash } from "./raidUtils"
import RaidStats from "~/models/profile/data/RaidStats"

export function partitionStatsByRaid(data: DestinyAggregateActivityResults[]) {
    const allStats = data.map(d => d.activities).flat()
    const coll = new Collection<ListedRaid, DestinyAggregateActivityStats["values"][]>()
    for (const { activityHash, values } of Array.from(allStats)) {
        try {
            const [raid] = raidTupleFromHash(String(activityHash))
            if (coll.has(raid)) {
                coll.get(raid)!.push(values)
            } else {
                coll.set(raid, [values])
            }
        } catch {} // most activities are not raids
    }
    return coll.mapValues((record, raid) => new RaidStats(record, raid))
}
