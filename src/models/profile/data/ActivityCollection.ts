import AbstractRaidDataCollection from "./AbstractRaidDataCollection"
import ActivityDifficultyCollection from "./ActivityDifficultyCollection"
import { Difficulty } from "../../../types/raids"
import Activity from "./Activity"
import { Collection } from "@discordjs/collection"
import { FilterCallback } from "~/types/generic"
import { ExtendedActivity } from "~/types/profile"

export default class ActivityCollection extends AbstractRaidDataCollection<
    ActivityDifficultyCollection,
    Activity
> {
    add(difficulty: Difficulty, values: Activity[]): void {
        this.set(difficulty, new ActivityDifficultyCollection(values, this.raid, difficulty))
    }

    get all() {
        return this.reduce(
            (a, b) => a.concat(b.collection),
            new Collection<string, Activity>()
        ).sort((a, b) => a.endDate.getTime() - b.endDate.getTime())
    }
}

export function applyFilter(
    coll: Collection<string, Activity>,
    filter: FilterCallback<ExtendedActivity>,
    extended: {}
) {
    return new Collection(
        coll
            .map(a => ({
                activity: a,
                // todo
                extended: {
                    fresh: false,
                    playerCount: 6,
                    flawless: false
                }
            }))
            .filter(filter)
            .map(a => [a.activity.instanceId, a])
    )
}
