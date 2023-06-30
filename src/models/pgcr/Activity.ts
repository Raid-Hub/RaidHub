import {
    DestinyPostGameCarnageReportData,
    DestinyHistoricalStatsValuePair
} from "bungie-net-core/models"
import { Difficulty, raidDetailsFromHash, Raid } from "../../util/destiny/raid"
import { Tag, addModifiers } from "../../util/raidhub/tags"
import { Seasons } from "../../util/destiny/dates"
import ActivityStats from "./ActivityStats"
import RaidInfo from "./RaidInfo"
import { ActivityPlacements } from "../../types/types"
import { LocalStrings } from "../../util/presentation/localized-strings"
import PGCRMember from "./Member"

export default class Activity {
    private _fresh: boolean | null
    private _complete: boolean
    private _startedTime: Date
    private _playerCount: number
    private _flawless: boolean
    private _speed: DestinyHistoricalStatsValuePair
    private _raidManifest: RaidInfo<any>
    private _placements: ActivityPlacements
    private _tags: Tag[]
    readonly hash: number
    readonly stats: ActivityStats
    readonly completionDate: Date
    constructor(pgcr: DestinyPostGameCarnageReportData, members: PGCRMember[]) {
        this.hash = pgcr.activityDetails.directorActivityHash
        this._complete = pgcr.entries.some(e => e.values.completed?.basic.value)
        this._startedTime = new Date(pgcr.period)
        this.completionDate = new Date(
            this._startedTime.getTime() +
                pgcr.entries[0].values.activityDurationSeconds.basic.value * 1000
        )
        this._playerCount = new Set(
            pgcr.entries.map(({ player }) => player.destinyUserInfo.membershipId)
        ).size
        this._flawless =
            this._complete &&
            pgcr.entries.reduce((b, entry) => b && entry.values.deaths?.basic.value === 0, true)
        this._speed = pgcr.entries[0].values.activityDurationSeconds.basic
        /* This is kinda ugly but its a 1 liner :) */
        this._fresh = this.isFresh(pgcr.startingPhaseIndex, pgcr.activityWasStartedFromBeginning)
        this.stats = new ActivityStats([this._startedTime, this.completionDate], members)
        this._raidManifest = raidDetailsFromHash(`${this.hash}`)
        this._placements = {}
        this._tags = []
        if (this._raidManifest.isDayOne(this.completionDate)) this._tags.push(Tag.DAY_ONE)
        if (this._raidManifest.isContest(this._startedTime)) {
            switch (this._raidManifest.difficulty) {
                case Difficulty.CHALLENGEKF:
                    this._tags.push(Tag.CHALLENGE_KF)
                    break
                case Difficulty.CHALLENGEVOG:
                    this._tags.push(Tag.CHALLENGE_VOG)
                    break
                default:
                    this._tags.push(Tag.CONTEST)
            }
        }
        if (this._fresh === false) this._tags.push(Tag.CHECKPOINT)
        if (this._raidManifest.difficulty === Difficulty.MASTER) this._tags.push(Tag.MASTER)
        if (this._playerCount === 1) this._tags.push(Tag.SOLO)
        else if (this._playerCount === 2) this._tags.push(Tag.DUO)
        else if (this._playerCount === 3) this._tags.push(Tag.TRIO)
        if (this._fresh && this._complete) {
            if (this._flawless) this._tags.push(Tag.FLAWLESS)
            if (this.stats.killsTypeRatio.ability === 100) this._tags.push(Tag.ABILITIES_ONLY)
        }
    }

    get raid(): Raid {
        return this._raidManifest.raid
    }

    get speed(): {
        fresh: boolean | null
        duration: string
        complete: boolean
    } {
        return {
            fresh: this._fresh,
            duration: this._speed.displayValue,
            complete: this._complete
        }
    }

    tags(strings: LocalStrings): string[] {
        return this._tags.map(tag => this.placementTag(tag, strings.tags[tag]))
    }

    title(strings: LocalStrings): string {
        return addModifiers(this._raidManifest.raid, this._tags, strings)
    }

    /**
     * Given a report, determines if it was completed from the start
     * @returns null if it cannot be determined
     */
    private isFresh(
        startingPhaseIndex: number | undefined,
        activityWasStartedFromBeginning: boolean | undefined
    ): boolean | null {
        if (this.completionDate.getTime() < Seasons[12].start.getTime()) {
            /* pre-BL -- startingPhaseIndex working as intended */
            return startingPhaseIndex === 0
        } else if (this.completionDate.getTime() < Seasons[16].start.getTime()) {
            /* beyond light -- startingPhaseIndex reporting 0 always */
            return null
        } else if (this.completionDate.getTime() < Seasons[17].start.getTime()) {
            /* season of the risen -- activityWasStartedFromBeginning added but not populating properly
       because a wipe made it not fresh */
            return activityWasStartedFromBeginning || null
        } else {
            /* modern era -- working as intended with activityWasStartedFromBeginning */
            return !!activityWasStartedFromBeginning
        }
    }

    private placementTag(tag: Tag, tagString: string): string {
        const placement = this._placements[tag]
        if (placement) return `${tagString} #${placement}`
        else return tagString
    }
}
