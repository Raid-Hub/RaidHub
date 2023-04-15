import {
    DestinyPostGameCarnageReportData,
    DestinyHistoricalStatsValuePair
} from "oodestiny/schemas"
import { RaidDifficulty, raidDetailsFromHash, Raid } from "../../util/raid"
import { Tag, addModifiers } from "../../util/tags"
import { Seasons } from "../../util/dates"
import { ActivityStats } from "./ActivityStats"
import { PGCRMember } from "./Entry"
import { RaidInfo } from "./raid"
import { ActivityPlacements } from "../../util/types"
import { LocalStrings } from "../../util/localized-strings"

export class Activity {
    private _activityHash: number
    private _fresh: boolean | null
    private _complete: boolean
    private _startedTime: Date
    private _finishedTime: Date
    private _playerCount: number
    private _flawless: boolean
    private _speed: DestinyHistoricalStatsValuePair
    private _stats: ActivityStats
    private _raidManifest: RaidInfo
    private _placements: ActivityPlacements
    private _tags: Tag[]
    constructor(pgcr: DestinyPostGameCarnageReportData, members: PGCRMember[]) {
        this._activityHash = pgcr.activityDetails.directorActivityHash
        this._complete = pgcr.entries.some(e => e.values.completed?.basic.value)
        this._startedTime = new Date(pgcr.period)
        this._finishedTime = new Date(
            this._startedTime.getTime() +
                pgcr.entries[0].values.activityDurationSeconds.basic.value * 1000
        )
        this._playerCount = new Set(
            pgcr.entries.map(({ player }) => player.destinyUserInfo.membershipId)
        ).size
        this._flawless =
            this._complete &&
            pgcr.entries.reduce((b, entry) => b && entry.values.deaths?.basic.value == 0, true)
        this._speed = pgcr.entries[0].values.activityDurationSeconds.basic
        /* This is kinda ugly but its a 1 liner :) */
        this._fresh = this.isFresh(pgcr.startingPhaseIndex, pgcr.activityWasStartedFromBeginning)
        this._stats = new ActivityStats(pgcr, members)
        this._raidManifest = raidDetailsFromHash(`${this._activityHash}`)
        this._placements = {}
        this._tags = []
        if (this._raidManifest.isDayOne(this._finishedTime)) this._tags.push(Tag.DAY_ONE)
        if (this._raidManifest.isContest(this._startedTime)) {
            switch (this._raidManifest.difficulty) {
                case RaidDifficulty.CHALLENGEKF:
                    this._tags.push(Tag.CHALLENGE_KF)
                    break
                case RaidDifficulty.CHALLENGEVOG:
                    this._tags.push(Tag.CHALLENGE_VOG)
                    break
                default:
                    this._tags.push(Tag.CONTEST)
            }
        }
        if (this._fresh === false) this._tags.push(Tag.CHECKPOINT)
        if (this._raidManifest.difficulty === RaidDifficulty.MASTER) this._tags.push(Tag.MASTER)
        if (this._playerCount === 1) this._tags.push(Tag.SOLO)
        else if (this._playerCount === 2) this._tags.push(Tag.DUO)
        else if (this._playerCount === 3) this._tags.push(Tag.TRIO)
        if (this._fresh && this._complete) {
            if (this._flawless) this._tags.push(Tag.FLAWLESS)
            if (this._stats.killsTypeRatio.ability === 100) this._tags.push(Tag.ABILITIES_ONLY)
        }
    }

    get raid(): Raid {
        return this._raidManifest.raid
    }

    get completionDate() {
        return this._finishedTime
    }

    get speed() {
        return {
            fresh: this._fresh,
            duration: this._speed.displayValue,
            complete: this._complete
        }
    }

    get stats(): ActivityStats {
        return this._stats
    }

    tags(strings: LocalStrings): string[] {
        return this._tags.map(tag => this.placementTag(tag, strings.tags[tag]))
    }

    title(strings: LocalStrings): string {
        return addModifiers(this._raidManifest.raid, this._tags, strings)
    }

    set placements(placements: ActivityPlacements) {
        this._placements = placements
    }

    /**
     * Given a report, determines if it was completed from the start
     * @returns null if it cannot be determined
     */
    private isFresh(
        startingPhaseIndex: number | undefined,
        activityWasStartedFromBeginning: boolean | undefined
    ): boolean | null {
        if (this._finishedTime.getTime() < Seasons[12].start.getTime()) {
            /* pre-BL -- startingPhaseIndex working as intended */
            return startingPhaseIndex === 0
        } else if (this._finishedTime.getTime() < Seasons[16].start.getTime()) {
            /* beyond light -- startingPhaseIndex reporting 0 always */
            return null
        } else if (this._finishedTime.getTime() < Seasons[17].start.getTime()) {
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
