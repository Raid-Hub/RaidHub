import { Collection } from "@discordjs/collection"
import {
    DestinyHistoricalStatsActivity,
    DestinyHistoricalStatsPeriodGroup,
    DestinyHistoricalStatsValue
} from "bungie-net-core/models"
import { ListedRaid, Difficulty } from "../../../types/raids"
import { raidTupleFromHash } from "../../../util/destiny/raidUtils"

export default class Activity implements DestinyHistoricalStatsPeriodGroup {
    readonly period: string
    readonly activityDetails: DestinyHistoricalStatsActivity
    readonly values: { [key: string]: DestinyHistoricalStatsValue }

    readonly startDate: Date
    readonly endDate: Date
    readonly hash: string
    readonly raid: ListedRaid
    readonly difficulty: Difficulty
    constructor(data: DestinyHistoricalStatsPeriodGroup) {
        this.period = data.period
        this.activityDetails = data.activityDetails
        this.values = data.values

        this.startDate = new Date(data.period)
        this.endDate = new Date(this.startDate.getTime() + this.durationSeconds * 1000)
        this.hash = this.activityDetails.directorActivityHash.toString()
        ;[this.raid, this.difficulty] = raidTupleFromHash(this.hash)
    }

    get completed() {
        return !!this.values.completed.basic.value
    }

    get durationSeconds() {
        return this.values.activityDurationSeconds.basic.value
    }

    get instanceId() {
        return this.activityDetails.instanceId
    }

    get playerCount() {
        const count = this.values.playerCount.basic.value
        return count < 0 ? Infinity : count
    }

    static collection(array: DestinyHistoricalStatsPeriodGroup[]): Collection<string, Activity> {
        return new Collection(array.map(a => [a.activityDetails.instanceId, new Activity(a)]))
    }

    static combineCollections(x: Collection<string, Activity>, y: Collection<string, Activity>) {
        return x.merge(
            y,
            (a: Activity) => ({
                keep: true,
                value: a
            }),
            (b: Activity) => ({
                keep: true,
                value: b
            }),
            (a: Activity, b: Activity) => ({
                keep: true,
                // keep the completed one or the one with more time
                value: !!a.completed
                    ? a
                    : !!b.completed
                    ? b
                    : a.durationSeconds > b.durationSeconds
                    ? a
                    : b
            })
        )
    }
}
