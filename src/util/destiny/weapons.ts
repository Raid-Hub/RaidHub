import { Collection } from "@discordjs/collection"
import { DestinyHistoricalWeaponStats } from "bungie-net-core/models"
import WeaponsJson from "../../util/destiny-definitions/weapons.json" assert { type: "json" }
import { PlayerWeapons } from "../../types/pgcr"

const weaponsDefs: {
    [hash: string]: {
        name?: { [language: string]: string }
        icon?: string
        type?: string
    }
} = WeaponsJson

export function parseWeapons(weapons: DestinyHistoricalWeaponStats[]): PlayerWeapons {
    return new Collection(
        weapons.map(({ referenceId, values }) => {
            const def = weaponsDefs[referenceId]
            return [
                referenceId,
                {
                    name: def?.name ?? {},
                    icon: "https://bungie.net" + (def?.icon ?? "/img/misc/missing_icon_d2.png"),
                    type: def?.type ?? "Unknown",
                    kills: values.uniqueWeaponKills.basic.value,
                    precision: values.uniqueWeaponPrecisionKills.basic.value
                }
            ]
        })
    ).sort((a, b) => b.kills - a.kills)
}

export function mergeWeaponCollections(collections: PlayerWeapons[]): PlayerWeapons {
    return collections
        .reduce(
            (collection, weapons) =>
                collection.merge(
                    weapons,
                    c1 => ({ keep: true, value: c1 }),
                    c2 => ({ keep: true, value: c2 }),
                    (c1, c2) => ({
                        keep: true,
                        value: {
                            ...c1,
                            kills: c1.kills + c2.kills,
                            precision: c1.precision + c2.precision
                        }
                    })
                ),
            new Collection()
        )
        .sort((a, b) => b.kills - a.kills)
}
