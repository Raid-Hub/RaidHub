import { ContestEnd, ContestRaidDifficulties, DayOneEnd, Raid, RaidDifficulty } from "../../util/raid";

export class RaidInfo {
    name: Raid
    difficulty: RaidDifficulty
    constructor(name: Raid, difficulty: RaidDifficulty) {
        this.name = name
        this.difficulty = difficulty
    }
    isDayOne(ended: Date): boolean {
        if (DayOneEnd[this.name] === undefined) {
            return false;
        } else {
            return ended.getTime() <= DayOneEnd[this.name]!.getTime()
        }
    }

    isContest(started: Date): boolean {
        if (ContestEnd[this.name] === undefined) {
            return false;
        } else if (ContestRaidDifficulties.includes(this.difficulty)) {
            return true
        } else {
            return started.getTime() < ContestEnd[this.name]!.getTime()
        }
    }
}