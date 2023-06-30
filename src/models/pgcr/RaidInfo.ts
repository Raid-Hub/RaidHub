import {
    ContestEnd,
    ContestRaidDifficulties,
    DayOneEnd,
    Raid,
    Difficulty,
    RaidDifficultyTuple
} from "../../util/destiny/raid"

export default class RaidInfo<R extends Raid> {
    raid: Raid
    difficulty: Difficulty
    constructor([name, difficulty]: RaidDifficultyTuple) {
        this.raid = name
        this.difficulty = difficulty as Difficulty
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
