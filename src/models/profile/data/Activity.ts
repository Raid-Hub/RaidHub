import { ListedRaid, Difficulty } from "../../../types/raids"
import { raidTupleFromHash } from "../../../util/destiny/raidUtils"
import { RaidHubActivitiesResponse } from "~/types/raidhub-api"
import { BungieMembershipType } from "bungie-net-core/models"

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
    readonly durationSeconds: number
    readonly dayOne: boolean
    readonly contest: boolean
    readonly platform: BungieMembershipType
    readonly player: RaidHubActivitiesResponse["activities"][number]["player"]

    readonly weight: number
    constructor(data: RaidHubActivitiesResponse["activities"][number]) {
        this.activityId = data.instanceId
        this.flawless = !!data.flawless
        this.completed = data.completed
        this.fresh = !!data.fresh
        this.playerCount = data.playerCount
        this.platform = data.platform
        this.dateStarted = new Date(data.dateStarted)
        this.dateCompleted = new Date(data.dateCompleted)
        this.dayOne = data.dayOne
        this.contest = data.contest
        ;[this.raid, this.difficulty] = raidTupleFromHash(data.raidHash)
        this.player = data.player

        this.durationSeconds = Math.floor(
            (this.dateCompleted.getTime() - this.dateStarted.getTime()) / 1000
        )
        // non lowman 2 => 1 => 0
        // trio => 2 => 1
        // duo => 4 => 3
        // solo => 8 => 7
        const adjustedPlayerCount = (1 << Math.max(0, 4 - Math.min(this.playerCount, 6))) - 1
        const adjustedDifficulty = Number(
            ![Difficulty.NORMAL, Difficulty.GUIDEDGAMES].includes(this.difficulty)
        )
        /*
        This is a bitfield to measure the weight of an activity. If its not flawless or a lowman, it has 0 weight.
        From the right, 
        - bit 0 is for master/prestige.
        - bit 1 for fresh
        - bit 2 for flawless
        - bit 3,4,5 for trio, duo, and solo respectively
        */
        this.weight =
            this.completed && (this.flawless || this.playerCount <= 3)
                ? (adjustedPlayerCount << 3) +
                  ((this.flawless ? 1 : 0) << 2) +
                  ((this.fresh ? 1 : 0) << 1) +
                  adjustedDifficulty
                : 0
    }
}
