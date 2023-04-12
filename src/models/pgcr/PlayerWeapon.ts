import { Collection } from "@discordjs/collection"
import { DestinyHistoricalWeaponStats } from "oodestiny/schemas"
import WeaponsJson from "../../util/destiny-definitions/weapons.json" assert { type: "json" }
const weaponsDefs: {
    [hash: string]: {
        name?: { [language: string]: string }
        icon?: string
        type?: string
    }
} = WeaponsJson

export interface WeaponStatsValues {
    kills: number
    precision: number
    name: { [language: string]: string }
    type: string
    icon: string
}

export class PlayerWeapons extends Collection<number, WeaponStatsValues> {
    static fromArray(weapons: DestinyHistoricalWeaponStats[][]): PlayerWeapons {
        let collection = new PlayerWeapons()
        weapons.forEach(weapon => {
            const singleCollection = PlayerWeapons.fromSingle(weapon)
            /** merges stats */
            collection = collection.merge(
                singleCollection,
                x => ({ keep: true, value: x }),
                y => ({ keep: true, value: y }),
                (x, y) => ({
                    keep: true,
                    value: {
                        ...x,
                        kills: x.kills + y.kills,
                        precision: x.precision + y.precision
                    }
                })
            )
        })
        return collection.sort((a, b) => b.kills - a.kills)
    }

    static fromSingle(weapons: DestinyHistoricalWeaponStats[]): PlayerWeapons {
        return new PlayerWeapons(
            weapons?.map(weapon => {
                const def = weaponsDefs[weapon.referenceId]
                return [
                    weapon.referenceId,
                    {
                        name: def?.name ?? {},
                        icon: "https://bungie.net" + (def?.icon ?? "/img/misc/missing_icon_d2.png"),
                        type: def?.type ?? "Unknown",
                        kills: weapon.values.uniqueWeaponKills.basic.value,
                        precision: weapon.values.uniqueWeaponPrecisionKills.basic.value
                    }
                ]
            })
        ).sort((a, b) => b.kills - a.kills)
    }
}
