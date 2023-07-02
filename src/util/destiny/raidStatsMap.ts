import { DestinyAggregateActivityStats, DestinyHistoricalStatsValue } from "bungie-net-core/models"
import { AllValidHashes, HashDictionary, Raid, RaidDifficultyTuple, ValidRaidHash } from "./raid"
import RaidStats from "../../models/profile/RaidStats"

export type DestinyHistoricalStatsDictionary = { [key: string]: DestinyHistoricalStatsValue }

export function raidStatsMap(stats: DestinyAggregateActivityStats[]): Map<Raid, RaidStats> {
    const map = new Map<RaidDifficultyTuple, DestinyHistoricalStatsDictionary[]>()
    stats.forEach(({ activityHash, values }) => {
        const hash = activityHash.toString() as ValidRaidHash
        if (AllValidHashes.includes(hash)) {
            const key = HashDictionary[hash]
            if (map.has(key)) {
                map.get(key)!.push(values)
            } else {
                map.set(key, [values])
            }
        }
    })

    const raidMap = new Map<Raid, RaidStats>()
    map.forEach((values, [raid, difficulty]) => {
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
