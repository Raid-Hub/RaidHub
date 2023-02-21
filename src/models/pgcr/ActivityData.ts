import { DestinyPostGameCarnageReportData, DestinyHistoricalStatsValuePair, DestinyPostGameCarnageReportEntry } from 'oodestiny/schemas'
import { RaidDifficulty, RaidInfo, raidFromHash } from "../../util/raid-hashes"
import { Tags } from '../../util/tags'
import { Seasons } from '../../util/dates'
import { ActivityStats } from './ActivityStats'
import { PGCRMember } from './Entry'

export class ActivityData {
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
  }

  get name(): string {
    return this._raidManifest.name
  }

  get tags(): string[] {
    const tags: string[] = []
    if (this._raidManifest.isDayOne(this._finishedTime)) tags.push(Tags.DayOne)
    if (this._raidManifest.isContest(this._startedTime)) {
      switch (this._raidManifest.difficulty) {
        case RaidDifficulty.challengeKF: tags.push(Tags.ChallengeKF); break
        case RaidDifficulty.challengeVog: tags.push(Tags.ChallengeVog); break
        default: tags.push(Tags.Contest)
      }
    }
    if (this._fresh === false) tags.push(Tags.Checkpoint)
    if (this._raidManifest.difficulty === RaidDifficulty.master) tags.push(Tags.Master)
    if (this._playerCount === 1) tags.push(Tags.Solo)
    else if (this._playerCount === 2) tags.push(Tags.Duo)
    else if (this._playerCount === 3) tags.push(Tags.Trio)
    if (this._fresh && this._complete) {
      if (this._flawless) tags.push(Tags.Flawless)
      if (this._stats.killsTypeRatio.ability === 100) tags.push(Tags.AbilitiesOnly)
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
}