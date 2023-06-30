import { Difficulty } from "../../util/destiny/raid"
import { IRaidStats } from "../../types/types"
import RaidStatsForDifficulty from "./RaidStatsForDifficulty"

export default class RaidStats
    extends Map<Difficulty, RaidStatsForDifficulty>
    implements IRaidStats
{
    constructor(entries?: readonly (readonly [Difficulty, RaidStatsForDifficulty])[]) {
        super(entries)
    }
    get assists(): number {
        return Array.from(this.entries()).reduce((prev, [_, curr]) => curr.assists + prev, 0)
    }
    get deaths(): number {
        return Array.from(this.entries()).reduce((prev, [_, curr]) => curr.deaths + prev, 0)
    }
    get kills(): number {
        return Array.from(this.entries()).reduce((prev, [_, curr]) => curr.kills + prev, 0)
    }
    get precisionKills(): number {
        return Array.from(this.entries()).reduce((prev, [_, curr]) => curr.precisionKills + prev, 0)
    }
    get secondsPlayed(): number {
        return Array.from(this.entries()).reduce((prev, [_, curr]) => curr.secondsPlayed + prev, 0)
    }
    get fastestClear(): number {
        return Array.from(this.entries()).reduce((prev, [_, curr]) => curr.fastestClear + prev, 0)
    }
    get totalClears(): number {
        return Array.from(this.entries()).reduce((prev, [_, curr]) => curr.totalClears + prev, 0)
    }
    get averageClear(): number {
        return 0
    }
    get sherpas(): number {
        return Array.from(this.entries()).reduce((prev, [_, curr]) => curr.sherpas + prev, 0)
    }
}
