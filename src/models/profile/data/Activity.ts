import { ListedRaid, Difficulty } from "../../../types/raids"
import { raidTupleFromHash } from "../../../util/destiny/raidUtils"
import { Collection } from "@discordjs/collection"
import { RaidHubActivity } from "~/types/raidhub-api"

export default class Activity {
    readonly activityId: string
    readonly raid: ListedRaid
    readonly difficulty: Difficulty
    readonly flawless: boolean
    readonly completed: boolean
    readonly fresh: boolean
    readonly playerCount: number
    readonly dateStarted: Date
    readonly dateCompleted: Date
    readonly didMemberComplete: boolean
    constructor(data: RaidHubActivity) {
        this.activityId = data.activityId
        this.flawless = !!data.flawless
        this.completed = data.completed
        this.fresh = !!data.fresh
        this.playerCount = data.playerCount
        this.dateStarted = new Date(data.dateStarted)
        this.dateCompleted = new Date(data.dateCompleted)
        this.didMemberComplete = data.didMemberComplete
        ;[this.raid, this.difficulty] = raidTupleFromHash(data.raidHash)
    }

    get durationSeconds() {
        return Math.floor((this.dateCompleted.getTime() - this.dateStarted.getTime()) / 1000)
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
