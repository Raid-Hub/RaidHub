import { Collection, type ReadonlyCollection } from "@discordjs/collection"
import type { DestinyPostGameCarnageReportEntry } from "bungie-net-core/models"
import { o } from "~/util/o"
import type { WeaponKey } from "../types"

export default class DestinyPGCRCharacter {
    readonly characterId: string
    readonly completed: boolean
    readonly destinyUserInfo: DestinyPostGameCarnageReportEntry["player"]["destinyUserInfo"]
    readonly emblemHash: number
    readonly classHash: number
    readonly weapons: ReadonlyCollection<number, Record<WeaponKey, number>>
    readonly values: {
        readonly kills: number
        readonly deaths: number
        readonly assists: number
        readonly weaponKills: number
        readonly abilityKills: number
        readonly kdr: number
        readonly kda: number
        readonly precisionKills: number
        readonly superKills: number
        readonly grenadeKills: number
        readonly meleeKills: number
        readonly startSeconds: number
        readonly timePlayedSeconds: number
    }

    constructor(data: DestinyPostGameCarnageReportEntry) {
        this.characterId = data.characterId
        this.destinyUserInfo = data.player.destinyUserInfo
        this.emblemHash = data.player.emblemHash
        this.classHash = data.player.classHash

        const getValue = getEntryValue.bind(this, data)
        const getExtendedValue = getEntryExtendedValue.bind(this, data)

        const kills = getValue("kills")!
        const deaths = getValue("deaths")!
        const assists = getValue("assists")!
        this.completed = !!getValue("completed") && getValue("completionReason") === 0

        this.weapons = new Collection(
            data.extended.weapons?.map(
                ({ referenceId, values }) =>
                    [referenceId, o.mapValues(values, (_, value) => value.basic.value)] as const
            )
        ).sort((a, b) => b.uniqueWeaponKills - a.uniqueWeaponKills)

        const weaponKills = this.weapons.reduce(
            (base, weapon) => base + weapon.uniqueWeaponKills,
            0
        )

        this.values = {
            kills,
            deaths,
            assists,
            weaponKills,
            abilityKills: kills - weaponKills,
            kdr: kills / (deaths || 1),
            kda: (kills + assists) / (deaths || 1),
            precisionKills: getExtendedValue("precisionKills")!,
            superKills: getExtendedValue("weaponKillsSuper")!,
            grenadeKills: getExtendedValue("weaponKillsGrenade")!,
            meleeKills: getExtendedValue("weaponKillsMelee")!,
            startSeconds: getValue("startSeconds")!,
            timePlayedSeconds: getValue("timePlayedSeconds")!
        }
    }
}

const getEntryValue = (
    data: DestinyPostGameCarnageReportEntry,
    key:
        | "kills"
        | "deaths"
        | "assists"
        | "completed"
        | "completionReason"
        | "activityDurationSeconds"
        | "timePlayedSeconds"
        | "startSeconds"
): number | undefined => data.values[key]?.basic.value

const getEntryExtendedValue = (
    data: DestinyPostGameCarnageReportEntry,
    key:
        | "precisionKills"
        | "weaponKillsAbility"
        | "weaponKillsGrenade"
        | "weaponKillsMelee"
        | "weaponKillsSuper"
): number | undefined => data.extended.values[key]?.basic.value
