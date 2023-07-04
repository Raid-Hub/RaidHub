import {
    DestinyAggregateActivityStats,
    DestinyHistoricalStatsValue
} from "bungie-net-core/lib/models"
import { AllValidHashes, Difficulty, HashDictionary, Raid, ValidRaidHash } from "./raid"
import RaidStats from "../../models/profile/RaidStats"

export type DestinyHistoricalStatsDictionary = { [key: string]: DestinyHistoricalStatsValue }

export function raidStatsMap(stats: DestinyAggregateActivityStats[]): Map<Raid, RaidStats> {
    // the key for this map is "Raid+Difficulty"
    const map = new Map<string, DestinyHistoricalStatsDictionary[]>()
    stats.forEach(({ activityHash, values }) => {
        const hash = activityHash.toString() as ValidRaidHash
        if (AllValidHashes.includes(hash)) {
            const key = HashDictionary[hash].join("+")
            if (map.has(key)) {
                map.get(key)!.push(values)
            } else {
                map.set(key, [values])
            }
        }
    })

    const raidMap = new Map<Raid, RaidStats>()
    map.forEach((values, key) => {
        // deconstruct the key
        const [raid, difficulty] = key.split("+").map(char => parseInt(char)) as [Raid, Difficulty]
        if (raidMap.has(raid)) {
            raidMap.get(raid)!.add(difficulty, values)
        } else {
            const newStats = new RaidStats()
            raidMap.set(raid, newStats)
            newStats.add(difficulty, values)
        }
    })

    return raidMap
}
