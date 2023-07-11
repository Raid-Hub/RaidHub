import { Difficulty } from "../../types/raids"
import RaidStats from "./RaidStats"
import { DestinyHistoricalStatsDictionary, IRaidStats } from "../../types/profile"
import AbstractRaidDataCollection from "./AbstractRaidDataCollection"

export default class RaidStatsCollection
    extends AbstractRaidDataCollection<RaidStats, DestinyHistoricalStatsDictionary>
    implements IRaidStats
{
    add(difficulty: Difficulty, values: DestinyHistoricalStatsDictionary[]) {
        this.set(difficulty, new RaidStats(values, this.raid, difficulty))
    }
    private reduceStat(key: keyof IRaidStats) {
        return this.reduce((base, stats) => stats[key] + base, 0)
    }
    get assists() {
        return this.reduceStat("assists")
    }
    get deaths() {
        return this.reduceStat("deaths")
    }
    get kills() {
        return this.reduceStat("kills")
    }
    get precisionKills() {
        return this.reduceStat("precisionKills")
    }
    get secondsPlayed() {
        return this.reduceStat("secondsPlayed")
    }
    get totalClears() {
        return this.reduceStat("totalClears")
    }
}
