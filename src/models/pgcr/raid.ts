import {
    ContestEnd,
    ContestRaidDifficulties,
    DayOneEnd,
    Raid,
    RaidDifficulty
} from "../../util/raid"

export class RaidInfo {
    raid: Raid
    difficulty: RaidDifficulty
    constructor(name: Raid, difficulty: RaidDifficulty) {
        this.raid = name
        this.difficulty = difficulty
    }
    isDayOne(ended: Date): boolean {
        if (DayOneEnd[this.raid] === undefined) {
            return false
        } else {
            return ended.getTime() <= DayOneEnd[this.raid]!.getTime()
        }
    }

    isContest(started: Date): boolean {
        if (ContestEnd[this.raid] === undefined) {
            return false
        } else if (ContestRaidDifficulties.includes(this.difficulty)) {
            return true
        } else {
            return started.getTime() < ContestEnd[this.raid]!.getTime()
        }
    }
}
