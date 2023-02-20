import { DestinyPostGameCarnageReportData, DestinyHistoricalStatsValuePair, DestinyPostGameCarnageReportEntry } from 'oodestiny/schemas'
import { RaidInfo, raidFromHash } from "../../util/raid-hashes"
import { Tags } from '../../util/tags'
import { Seasons } from '../../util/dates'
import { PGCRMember } from './Entry'
import { round } from '../../util/math'

export class ActivityData {
  private _activityHash: number
  private _fresh: boolean | null
  private _complete: boolean
  private _startedTime: Date
  private _finishedTime: Date
  private _playerCount: number
  private _flawless: boolean
  private _speed: DestinyHistoricalStatsValuePair
  private _members: PGCRMember[]
  constructor(data: DestinyPostGameCarnageReportData) {
    this._activityHash = data.activityDetails.directorActivityHash
    this._complete = data.entries.some(e => e.values['completed'].basic.value)
    this._startedTime = new Date(data.period);
    this._finishedTime = new Date(this._startedTime.getTime() + data.entries[0].values.activityDurationSeconds.basic.value * 1000)
    this._playerCount = (new Set(data.entries.map(e => e.player.destinyUserInfo.membershipId))).size
    this._flawless = this._complete && data.entries.reduce((b, entry) => b && entry.values["deaths"].basic.value == 0, true)
    this._speed = data.entries[0].values.activityDurationSeconds.basic
    this._fresh = data.activityWasStartedFromBeginning === false ? this.badWqCpData() : data.activityWasStartedFromBeginning ?? data.startingPhaseIndex === 0 ?? null
    const dict: Record<string, DestinyPostGameCarnageReportEntry[]> = {}
    data.entries.forEach(entry => (dict[entry.player.destinyUserInfo.membershipId] ??= []).push(entry))
    this._members = Object.entries(dict).map(([id, vals]) => new PGCRMember(id, vals))
  }

  get raidManifest(): RaidInfo {
    return raidFromHash(`${this._activityHash}`);
  }

  get name(): string {
    return this.raidManifest.name
  }

  get difficulty(): string {
    return this.raidManifest.isContest(this._startedTime) ? "Contest" : this.raidManifest.difficulty
  }

  get tags(): string[] {
    const tags: string[] = []
    if (this.raidManifest.isDayOne(this._finishedTime)) tags.push(Tags.DayOne)
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
   * Determines the MVP of the activity by KDA (kills as the tiebreaker)
   */
  get mvp(): string {
    return (this._members.reduce((mvp, current) => (
      (current.stats.kda === mvp.stats.kda)
        ? (current.stats.kills > mvp.stats.kills ? current : mvp)
        : (current.stats.kda > mvp.stats.kda ? current : mvp)
    ), { stats: { kda: 0, kills: 0 } }) as PGCRMember).displayName
  }

  get totalKills() {
    return this._members.reduce((total, current) => (
      total + current.stats.kills
    ), 0)
  }

  get totalDeaths() {
    return this._members.reduce((total, current) => (
      total + current.stats.deaths
    ), 0)
  }

  get killsTypeRatio() {
    const { weapon, ability } = this._members.reduce((total, curr) => (
      {
        weapon: total.weapon + curr.stats.weaponKills,
        ability: total.ability + curr.stats.abilityKills,
      }
    ), { weapon: 0, ability: 0 })
    console.log( weapon, ability )
    return {
      weapon: round(weapon / (weapon + ability) * 100, 2),
      ability: round(ability / (weapon + ability) * 100, 2)
    }
  }

  /**
   * Given a report with a false 'activityWasStartedFromBeginning', 
   * determines if it was completed during Season of the Risen when any 
   * wipes were causing a report to be a checkpoint.
   * @returns null if the report was completed during Season of the Risen, otherwise returns false
   */
  private badWqCpData() {
    return this._startedTime.getTime() >= Seasons[16].start.getTime()
      && this._finishedTime.getTime() < Seasons[17].start.getTime() ? null : false
  }
}