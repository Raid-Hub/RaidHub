import { DestinyPostGameCarnageReportData, DestinyHistoricalStatsValuePair } from 'oodestiny/schemas'
import { RaidInfo, raidFromHash } from "../../util/raid-hashes"
import { Tags } from '../../util/tags'
import { Seasons } from '../../util/dates'

export class ActivityData {
  private _activityHash: number
  private _fresh: boolean | null
  private _complete: boolean
  private _startedTime: Date
  private _finishedTime: Date
  private _playerCount: number
  private _flawless: boolean
  private _speed: DestinyHistoricalStatsValuePair
  private _raidManifest: RaidInfo
  constructor(data: DestinyPostGameCarnageReportData) {
    this._activityHash = data.activityDetails.directorActivityHash
    this._complete = data.entries.some(e => e.values['completed'].basic.value)
    this._startedTime = new Date(data.period);
    this._finishedTime = new Date(this._startedTime.getTime() + data.entries[0].values.activityDurationSeconds.basic.value * 1000)
    this._playerCount = (new Set(data.entries.map(e => e.player.destinyUserInfo.membershipId))).size
    this._flawless = this._complete && data.entries.reduce((b, entry) => b && entry.values["deaths"].basic.value == 0, true)
    this._speed = data.entries[0].values.activityDurationSeconds.basic
    this._fresh = data.activityWasStartedFromBeginning === false ? this.badWqCpData() : data.activityWasStartedFromBeginning ?? data.startingPhaseIndex === 0 ?? null
    this._raidManifest = raidFromHash(`${this._activityHash}`);
    console.log(data.activityWasStartedFromBeginning)
  }

  get name(): string {
    console.log(this._activityHash)
    return raidFromHash(`${this._activityHash}`).name
  }

  get difficulty(): string {
    return this._raidManifest.isContest(this._startedTime) ? "Contest" : this._raidManifest.difficulty
  }

  get tags(): string[] {
    const tags: string[] = []
    if (this._raidManifest.isDayOne(this._finishedTime)) tags.push(Tags.DayOne)
    if (this.difficulty === "Contest") tags.push(Tags.Contest)
    if (this._fresh === false) tags.push(Tags.Checkpoint)
    if (this.difficulty === "Master") tags.push(Tags.Master)
    if (this._flawless && this._fresh && this._complete) tags.push(Tags.Flawless)
    if (this._playerCount === 1) tags.push(Tags.Solo)
    else if (this._playerCount === 2) tags.push(Tags.Duo)
    else if (this._playerCount === 3) tags.push(Tags.Trio)
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

  /**
   * Given a report with a false 'activityWasStartedFromBeginning', 
   * determines if it was completed during Season of the Risen when any 
   * wipes were causing a report to be a checkpoint.
   * @returns null if the report was completed during Season of the risen, otherwise returns false
   */
  private badWqCpData() {
    return this._startedTime.getTime() >= Seasons[16].start.getTime()
      && this._finishedTime.getTime() < Seasons[17].start.getTime() ? null : false
  }
}