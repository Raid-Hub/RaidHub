import { DestinyPostGameCarnageReportData, DestinyHistoricalStatsValuePair } from 'oodestiny/schemas'
import { RaidDifficulty, raidFromHash, Raid } from "../../util/raid"
import { Tag } from '../../util/tags'
import { Seasons } from '../../util/dates'
import { ActivityStats } from './ActivityStats'
import { PGCRMember } from './Entry'
import { ActivityPlacements } from '../../util/server-connection'
import { RaidInfo } from './raid'

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
  constructor(pgcr: DestinyPostGameCarnageReportData, members: PGCRMember[]) {
    this._activityHash = pgcr.activityDetails.directorActivityHash
    this._complete = pgcr.entries.some(e => e.values.completed?.basic.value)
    this._startedTime = new Date(pgcr.period);
    this._finishedTime = new Date(this._startedTime.getTime() + pgcr.entries[0].values.activityDurationSeconds.basic.value * 1000)
    this._playerCount = (new Set(pgcr.entries.map(e => e.player.destinyUserInfo.membershipId))).size
    this._flawless = this._complete && pgcr.entries.reduce((b, entry) => b && entry.values.deaths?.basic.value == 0, true)
    this._speed = pgcr.entries[0].values.activityDurationSeconds.basic
    /* This is kinda ugly but its a 1 liner :) */
    this._fresh = this.isFresh(pgcr.startingPhaseIndex, pgcr.activityWasStartedFromBeginning)
    this._stats = new ActivityStats(pgcr, members)
    this._raidManifest = raidFromHash(`${this._activityHash}`);
    this._placements = {}
  }

  get name(): Raid {
    return this._raidManifest.name
  }

  get tags(): string[] {
    const tags: string[] = []
    if (this._raidManifest.isDayOne(this._finishedTime)) tags.push(this.placementTag(Tag.DAY_ONE))
    if (this._raidManifest.isContest(this._startedTime)) {
      switch (this._raidManifest.difficulty) {
        case RaidDifficulty.CHALLENGEKF: tags.push(this.placementTag(Tag.CHALLENGE_KF)); break
        case RaidDifficulty.CHALLENGEVOG: tags.push(this.placementTag(Tag.CHALLENGE_VOG)); break
        default: tags.push(this.placementTag(Tag.CONTEST))
      }
    }
    if (this._fresh === false) tags.push(Tag.CHECKPOINT)
    if (this._raidManifest.difficulty === RaidDifficulty.MASTER) tags.push(this.placementTag(Tag.MASTER))
    if (this._playerCount === 1) tags.push(this.placementTag(Tag.SOLO))
    else if (this._playerCount === 2) tags.push(this.placementTag(Tag.DUO))
    else if (this._playerCount === 3) tags.push(this.placementTag(Tag.TRIO))
    if (this._fresh && this._complete) {
      if (this._flawless) tags.push(Tag.FLAWLESS)
      if (this._stats.killsTypeRatio.ability === 100) tags.push(Tag.AbilitiesOnly)
    }
    return tags;
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

  set placements(placements: ActivityPlacements) {
    this._placements = placements
  }

  /**
   * Given a report, determines if it was completed from the start
   * @returns null if it cannot be determined
   */
  private isFresh(startingPhaseIndex: number | undefined, activityWasStartedFromBeginning: boolean | undefined): boolean | null {
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

  private placementTag(tag: Tag): string {
    const placement = this._placements[tag]
    if (placement) return `${tag} #${placement}`
    else return tag
  }
}