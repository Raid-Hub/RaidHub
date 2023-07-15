import { RaidData } from "../../types/profile"
import { Difficulty, Raid } from "../../types/raids"
import { DestinyHistoricalStatsPeriodGroup } from "bungie-net-core/lib/models"
import Activity from "./Activity"
import { Collection } from "@discordjs/collection"
import { FilterCallback } from "../../types/generic"

export default class ActivityDifficultyCollection
    implements RaidData<DestinyHistoricalStatsPeriodGroup>
{
    readonly raid: Raid
    readonly difficulty: Difficulty
    readonly raw: Activity[]
    readonly collection: Collection<string, Activity>

    constructor(raw: Activity[], raid: Raid, difficulty: Difficulty) {
        this.raw = raw
        this.raid = raid
        this.difficulty = difficulty
        this.collection = Activity.collection(this.raw)
    }

    filter(filter: FilterCallback<Activity>): ActivityDifficultyCollection {
        return new ActivityDifficultyCollection(this.raw.filter(filter), this.raid, this.difficulty)
    }
}
