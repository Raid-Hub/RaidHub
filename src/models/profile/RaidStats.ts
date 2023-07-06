import { Difficulty } from "../../util/destiny/raid"
import RaidStatsForDifficulty from "./RaidStatsForDifficulty"
import { DestinyHistoricalStatsDictionary } from "../../util/destiny/raidStatsMap"
import { IRaidStats } from "../../types/profile"

export default class RaidStats
    extends Map<Difficulty, RaidStatsForDifficulty>
    implements IRaidStats
{
    add(difficulty: Difficulty, values: DestinyHistoricalStatsDictionary[]) {
        this.set(difficulty, new RaidStatsForDifficulty(values))
    }
    private reduce(key: keyof IRaidStats) {
        return Array.from(this.values()).reduce((prev, curr) => curr[key] + prev, 0)
    }
    get assists() {
        return this.reduce("assists")
    }
    get deaths() {
        return this.reduce("deaths")
    }
    get kills() {
        return this.reduce("kills")
    }
    get precisionKills() {
        return this.reduce("precisionKills")
    }
    get secondsPlayed() {
        return this.reduce("secondsPlayed")
    }
    get totalClears() {
        return this.reduce("totalClears")
    }
}
