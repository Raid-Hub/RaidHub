import { round } from "../../util/math"
import PlayerWeapons from "./PlayerWeapon"
import { StatsKeys } from "../../types/types"

const NINE_HR_SIX_MIN = 546

type StatsDictionary = {
    kills: number
    deaths: number
    assists: number
    startSeconds: number
    timePlayedSeconds: number
    weaponKills: number
    abilityKills: number
}

export default class PGCRStats {
    private _kills: number
    private _deaths: number
    private _assists: number
    private _startSeconds: number
    private _timePlayedSeconds: number
    private _weaponKills: number
    private _abilityKills: number
    private _weapons: PlayerWeapons
    // calculates a player's raw score for an activity, used to determine the MVP
    private _score: number
    constructor(data: StatsKeys | StatsKeys[]) {
        let stats: StatsDictionary
        if (Array.isArray(data)) {
            stats = PGCRStats.merge(data)
            this._weapons = PlayerWeapons.fromArray(data.map(({ extended }) => extended.weapons))
        } else {
            stats = {
                kills: data.values.kills.basic.value,
                deaths: data.values.deaths.basic.value,
                assists: data.values.assists.basic.value,
                startSeconds: data.values.startSeconds.basic.value,
                timePlayedSeconds: data.values.timePlayedSeconds.basic.value,
                weaponKills:
                    data.extended.weapons?.reduce(
                        (total, current) => total + current.values.uniqueWeaponKills.basic.value,
                        0
                    ) || 0,
                abilityKills:
                    data.extended.values.weaponKillsAbility.basic.value +
                    data.extended.values.weaponKillsGrenade.basic.value +
                    data.extended.values.weaponKillsMelee.basic.value +
                    data.extended.values.weaponKillsSuper.basic.value
            }
            this._weapons = PlayerWeapons.fromSingle(data.extended.weapons)
        }
        this._kills = stats.kills
        this._deaths = stats.deaths
        this._assists = stats.assists
        this._startSeconds = stats.startSeconds
        this._timePlayedSeconds = stats.timePlayedSeconds
        this._weaponKills = stats.weaponKills
        this._abilityKills = stats.abilityKills
        // ranking
        // rewarded for being in the activity for longer
        const killScore =
            ((this._kills + 0.5 * this._assists) / Math.sqrt(this._timePlayedSeconds)) * 1000
        // a multiplier based on your deaths per 5 minutes
        const deathScore = this._timePlayedSeconds / 300 / (this._deaths + 1)
        this._score = killScore * deathScore
    }

    private static merge(data: StatsKeys[]): StatsDictionary {
        const maxTimePlayed = data[0].values.activityDurationSeconds.basic.value
        const stats: StatsDictionary = {
            kills: 0,
            deaths: 0,
            assists: 0,
            startSeconds: Number.MAX_SAFE_INTEGER,
            timePlayedSeconds: 0,
            weaponKills: 0,
            abilityKills: 0
        }
        const weaponStats: {
            [key: string]: { kills: number; precision: number }
        } = {}
        data.forEach(entry => {
            stats.kills += entry.values.kills.basic.value
            stats.deaths += entry.values.deaths.basic.value
            stats.assists += entry.values.assists.basic.value
            stats.startSeconds = Math.min(entry.values.startSeconds.basic.value, stats.startSeconds)
            stats.timePlayedSeconds += entry.values.timePlayedSeconds.basic.value
            stats.weaponKills +=
                entry.extended.weapons?.reduce(
                    (total, current) => total + current.values.uniqueWeaponKills.basic.value,
                    0
                ) || 0
            stats.abilityKills +=
                entry.extended.values.weaponKillsAbility.basic.value +
                entry.extended.values.weaponKillsGrenade.basic.value +
                entry.extended.values.weaponKillsMelee.basic.value +
                entry.extended.values.weaponKillsSuper.basic.value
        })
        stats.timePlayedSeconds = Math.min(stats.timePlayedSeconds, maxTimePlayed)
        return stats
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
        return round(this._kills / (this._deaths || 1), 2)
    }

    get kda() {
        return round((this._kills + this._assists) / (this._deaths || 1), 2)
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
        return `${totalMinutes === NINE_HR_SIX_MIN ? ">" : ""}${hours}h ${minutes}m`
    }

    get weapons() {
        return this._weapons
    }

    get score(): number {
        return this._score
    }
}
