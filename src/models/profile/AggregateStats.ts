import {
    DestinyAggregateActivityResults,
    DestinyHistoricalStatsValue
} from "bungie-net-core/lib/models"
import { AllValidHashes, HashDictionary, Raid, ValidRaidHash } from "../../util/raid"
import RaidStats from "./RaidStats"
import RaidStatsForDifficulty from "./RaidStatsForDifficulty"
import { HistoricalStatsDict } from "../../util/types"

type InputHistoricalStatsValues = HistoricalStatsDict<DestinyHistoricalStatsValue>

export default class AggregateStats extends Map<Raid, RaidStats> {
    constructor(stats: DestinyAggregateActivityResults[]) {
        super()
        const statsMapArray = stats.map(
            ({ activities }) =>
                new Map(
                    activities
                        .filter(({ activityHash }) =>
                            AllValidHashes.includes(activityHash.toString() as ValidRaidHash)
                        )
                        .map(({ activityHash, values }) => [
                            activityHash.toString() as ValidRaidHash,
                            values
                        ])
                )
        )
        for (const setOfStats of statsMapArray) {
            AllValidHashes.forEach(hash => {
                const [raid, difficulty] = HashDictionary[hash]
                const dict = setOfStats.get(hash)
                if (!dict) return
                else if (this.has(raid)) {
                    const merged = merge(
                        dict as InputHistoricalStatsValues,
                        this.get(raid)!.get(difficulty)
                    )
                    this.get(raid)!.set(difficulty, merged)
                } else {
                    this.set(
                        raid,
                        new RaidStats([
                            [difficulty, merge(dict as InputHistoricalStatsValues, undefined)]
                        ])
                    )
                }
            })
        }
    }
}

function merge(
    a: InputHistoricalStatsValues,
    b?: RaidStatsForDifficulty | undefined
): RaidStatsForDifficulty {
    return new RaidStatsForDifficulty({
        activityAssists: a.activityAssists.basic.value + (b?.assists ?? 0),
        activityCompletions: a.activityCompletions.basic.value + (b?.totalClears ?? 0),
        activityDeaths: a.activityDeaths.basic.value + (b?.deaths ?? 0),
        activityKills: a.activityKills.basic.value + (b?.kills ?? 0),
        activityPrecisionKills: a.activityPrecisionKills.basic.value + (b?.precisionKills ?? 0),
        activitySecondsPlayed: a.activitySecondsPlayed.basic.value + (b?.secondsPlayed ?? 0)
    })
}
