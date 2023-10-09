import {
    DestinyHistoricalStatsActivity,
    DestinyHistoricalStatsPeriodGroup,
    DestinyHistoricalStatsValue
} from "bungie-net-core/models"
import { ListedRaid, Difficulty } from "../../../types/raids"
import { raidTupleFromHash } from "../../../util/destiny/raidUtils"
import { Collection } from "@discordjs/collection"

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

    addData(data: any) {
        // todo: add api data
        console.log({ adding: data })
    }

    get completed() {
        return !!this.values.completed.basic.value && this.values.completionReason.basic.value === 0
    }

    get durationSeconds() {
        return this.values.activityDurationSeconds.basic.value
    }

    get instanceId() {
        return this.activityDetails.instanceId
    }

    get playerCount() {
        // todo
        const count = this.values.playerCount.basic.value
        return count <= 0 ? Infinity : count
    }

    get fresh() {
        // todo
        return Number(this.instanceId) % 2 === 0
    }

    get flawless() {
        // todo
        return this.completed && this.fresh && this.values.deaths.basic.value === 0
    }

    get playerIds() {
        // todo
        return ["123", "456"]
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
