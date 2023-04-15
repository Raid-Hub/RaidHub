import { DestinyPostGameCarnageReportData } from "oodestiny/schemas"
import { PGCRMember } from "./Entry"
import { round } from "../../util/math"

export class ActivityStats {
    private _members: PGCRMember[]
    constructor(pgcr: DestinyPostGameCarnageReportData, members: PGCRMember[]) {
        this._members = members
    }

    /**
     * Determines the MVP of the activity by KDA (kills as the tiebreaker)
     */
    get mvp(): string {
        const member = this._members.reduce(
            (mvp, current) => (current.stats.score > mvp.stats.score ? current : mvp),
            { stats: { score: Number.MIN_SAFE_INTEGER } }
        ) as PGCRMember
        return member.displayName ?? member.membershipId
    }

    get totalKills() {
        return this._members.reduce((total, current) => total + current.stats.kills, 0)
    }

    get totalDeaths() {
        return this._members.reduce((total, current) => total + current.stats.deaths, 0)
    }

    get killsTypeRatio() {
        const { weapon, ability } = this._members.reduce(
            (total, curr) => ({
                weapon: total.weapon + curr.stats.weaponKills,
                ability: total.ability + curr.stats.abilityKills
            }),
            { weapon: 0, ability: 0 }
        )
        return {
            weapon: round((weapon / (weapon + ability || 1)) * 100, 2),
            ability: round((ability / (weapon + ability || 1)) * 100, 2)
        }
    }

    get totalCharactersUsed() {
        return this._members.reduce((total, curr) => total + curr.characterIds.length, 0)
    }

    get mostUsedWeapon() {
        return this._members
            .map(({ stats }) => stats.weapons.first())
            .reduce((mostKills, current) =>
                (current?.kills ?? 0) > (mostKills?.kills ?? 0) ? current : mostKills
            )
    }
}
