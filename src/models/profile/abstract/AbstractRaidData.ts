import { Difficulty, Raid } from "../../../types/raids"

export default abstract class RaidData<R> {
    readonly raid: Raid
    readonly difficulty: Difficulty
    readonly raw: R[]

    constructor(raw: R[], raid: Raid, difficulty: Difficulty) {
        this.raid = raid
        this.difficulty = difficulty
        this.raw = raw
    }
}
