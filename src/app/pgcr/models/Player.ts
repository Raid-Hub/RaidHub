import { Collection, type ReadonlyCollection } from "@discordjs/collection"
import type {
    BungieMembershipType,
    DestinyPostGameCarnageReportEntry
} from "bungie-net-core/models"
import { mergeWeaponCollections, type WeaponKey } from "~/util/destiny/weapons"
import { round } from "~/util/math"
import DestinyPGCRCharacter from "./Character"

export default class DestinyPGCRPlayer {
    readonly membershipId: string
    readonly membershipType: BungieMembershipType
    readonly characters: ReadonlyCollection<string, DestinyPGCRCharacter>
    readonly deathless: boolean
    readonly completed: boolean
    readonly weapons: ReadonlyCollection<number, Record<WeaponKey, number>>
    readonly values: {
        readonly kills: number
        readonly deaths: number
        readonly assists: number
        readonly weaponKills: number
        readonly abilityKills: number
        readonly timePlayedSeconds: number
        readonly precisionKills: number
        readonly superKills: number
        readonly grenadeKills: number
        readonly meleeKills: number
    }
    readonly score: number

    constructor(characters: ReadonlyCollection<string, DestinyPostGameCarnageReportEntry>) {
        this.membershipId = characters.first()!.player.destinyUserInfo.membershipId
        this.membershipType = characters.first()!.player.destinyUserInfo.membershipType

        this.characters = new Collection(
            characters
                .map(e => new DestinyPGCRCharacter(e))
                .sort((a, b) => {
                    if (+a.completed ^ +b.completed) {
                        return a.completed ? -1 : 1
                    } else {
                        return b.values.startSeconds - a.values.startSeconds
                    }
                })
                .map(c => [c.characterId, c])
        )
        this.deathless = this.characters.every(character => character.values.deaths === 0)
        this.completed = this.characters.some(character => character.completed)

        const reduce = (key: keyof DestinyPGCRCharacter["values"]) =>
            this.characters.reduce((base, c) => base + c.values[key] ?? 0, 0)

        this.values = {
            kills: reduce("kills"),
            deaths: reduce("deaths"),
            assists: reduce("assists"),
            weaponKills: reduce("weaponKills"),
            abilityKills: reduce("abilityKills"),
            timePlayedSeconds: reduce("timePlayedSeconds"),
            precisionKills: reduce("precisionKills"),
            superKills: reduce("superKills"),
            grenadeKills: reduce("grenadeKills"),
            meleeKills: reduce("meleeKills")
        }

        this.score = getPlayerScore({ ...this.values, didComplete: this.completed })
        this.weapons = mergeWeaponCollections(this.characters.map(c => c.weapons))
    }

    public readonly firstCharacter = () => this.characters.first()!
}

export function getPlayerScore({
    kills,
    assists,
    timePlayedSeconds,
    deaths,
    precisionKills,
    superKills,
    didComplete
}: {
    kills: number
    deaths: number
    assists: number
    timePlayedSeconds: number
    precisionKills: number
    superKills: number
    didComplete: boolean
}) {
    const adjustedTimePlayedSeconds = timePlayedSeconds || 1
    // kills weighted 2x assists, slight diminishing returns
    const killScore =
        (kills + 0.5 * assists) ** 0.95 / Math.sqrt(round(adjustedTimePlayedSeconds, -1) || 1)
    // a multiplier based on your time per deaths squared, normalized a bit by using deaths + 7
    const deathScore = (2 * adjustedTimePlayedSeconds) / (deaths + 7) ** 2

    const timeScore = adjustedTimePlayedSeconds / 360 // 10 points per hour

    const precisionScore = (precisionKills / (kills || 1)) * 10 // 1 point per 10% of kills

    const superScore = (superKills / (adjustedTimePlayedSeconds / 60)) * 5 // 1 point per super kill per minute

    const completionScore = didComplete ? 1 : 0.5

    const finalScore =
        (killScore * deathScore + timeScore + precisionScore + superScore) * completionScore

    return finalScore
}
