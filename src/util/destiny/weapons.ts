import { Collection } from "@discordjs/collection"
import { DestinyHistoricalWeaponStats, DestinyItemComponent } from "bungie-net-core/models"
import { PlayerWeapons } from "../../types/pgcr"
import { armorBuckets, weaponBuckets } from "~/data/inventory-item-buckets"

export function parseWeapons(weapons: DestinyHistoricalWeaponStats[]): PlayerWeapons {
    return new Collection(
        weapons.map(({ referenceId, values }) => {
            return [
                referenceId,
                {
                    hash: referenceId,
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
