import { DestinyHistoricalStatsValue, DestinyPostGameCarnageReportExtendedData } from 'oodestiny/schemas'
import { round } from '../../util/math';

export type StatsKeys = { values: Record<string, DestinyHistoricalStatsValue>, extended: DestinyPostGameCarnageReportExtendedData }


export class PGCRStats {
  private _kills: number;
  private _deaths: number;
  private _assists: number;
  private _startSeconds: number
  private _timePlayedSeconds: number
  private _weaponKills: number
  private _abilityKills: number
  constructor(data: StatsKeys | StatsKeys[]) {
    this._kills = 0
    this._deaths = 0
    this._assists = 0
    this._startSeconds = Number.MAX_SAFE_INTEGER
    this._timePlayedSeconds = 0
    this._weaponKills = 0
    this._abilityKills = 0
    if (Array.isArray(data)) {
      this.merge(data)
    } else {
      this.init(data)
    }
  }

  private init(data: StatsKeys) {
    this._kills = data.values.kills.basic.value
    this._deaths = data.values.deaths.basic.value
    this._assists = data.values.assists.basic.value
    this._startSeconds = data.values.startSeconds.basic.value
    this._timePlayedSeconds = data.values.timePlayedSeconds.basic.value
    this._weaponKills = data.extended.weapons?.reduce((total, current) => (
      total + current.values.uniqueWeaponKills.basic.value
    ), 0) || 0
    this._abilityKills = data.extended.values.weaponKillsAbility.basic.value
      + data.extended.values.weaponKillsGrenade.basic.value
      + data.extended.values.weaponKillsMelee.basic.value
      + data.extended.values.weaponKillsSuper.basic.value
  }

  private merge(data: StatsKeys[]) {
    const maxTimePlayed = data[0].values.activityDurationSeconds.basic.value;
    data.forEach(entry => {
      this._kills += entry.values.kills.basic.value
      this._deaths += entry.values.deaths.basic.value
      this._assists += entry.values.assists.basic.value
      this._startSeconds = Math.min(entry.values.startSeconds.basic.value, this._startSeconds)
      this._timePlayedSeconds += entry.values.timePlayedSeconds.basic.value
      this._weaponKills += entry.extended.weapons?.reduce((total, current) => (
        total + current.values.uniqueWeaponKills.basic.value
      ), 0) || 0
      this._abilityKills += (entry.extended.values.weaponKillsAbility.basic.value
        + entry.extended.values.weaponKillsGrenade.basic.value
        + entry.extended.values.weaponKillsMelee.basic.value
        + entry.extended.values.weaponKillsSuper.basic.value)
    })
    this._timePlayedSeconds = Math.min(this._timePlayedSeconds, maxTimePlayed)
  }

  get kills() {
    return this._kills
  }

  get deaths() {
    return this._deaths
  }

  get assists() {
    return this._assists
  }

  get kdr() {
    return round(this._kills / (this._deaths || 1), 2);
  }

  get kda() {
    return round((this._kills + this._assists) / (this._deaths || 1), 2);
  }

  get weaponKills() {
    return this._weaponKills
  }

  get abilityKills() {
    return this._abilityKills
  }

  get timePlayed() {
    const totalMinutes = round(this._timePlayedSeconds / 60, 0)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes - hours * 60
    return `${hours}h ${minutes}m`
  }

  get weapons(): Record<string, string> {
    // TODO
    return {}
  }
}