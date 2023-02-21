import { DestinyPostGameCarnageReportData, DestinyHistoricalStatsValuePair, DestinyPostGameCarnageReportEntry } from 'oodestiny/schemas'
import { RaidInfo, raidFromHash } from "../../util/raid-hashes"
import { Tags } from '../../util/tags'
import { Seasons } from '../../util/dates'
import { PGCRMember } from './Entry'
import { round } from '../../util/math'

export class ActivityStats {
  
  private _members: PGCRMember[]
  constructor(pgcr: DestinyPostGameCarnageReportData, members: PGCRMember[]) {
    this._members = members
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
    return {
      weapon: round(weapon / (weapon + ability || 1) * 100, 2),
      ability: round(ability / (weapon + ability || 1) * 100, 2)
    }
  }

  get totalCharactersUsed() {
    return this._members.reduce((total, curr) => (total + curr.characterIds.length), 0)
  }
}