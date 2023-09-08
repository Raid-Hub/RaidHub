import { Collection } from "@discordjs/collection"
import { DestinyHistoricalWeaponStats, DestinyItemComponent } from "bungie-net-core/models"
import { PlayerWeapons } from "../../types/pgcr"

export const weaponBuckets = {
    kinetic: 1498876634,
    energy: 2465295065,
    power: 953998645
}

export const armorBuckets = {
    helmet: 3448274439,
    arms: 3551918588,
    chest: 14239492,
    legs: 20886954,
    classItem: 1585787867
}

export function findWeaponInBucket(
    items: DestinyItemComponent[],
    bucket: keyof typeof weaponBuckets
) {
    return items.find(item => item.bucketHash === weaponBuckets[bucket])
}

export function findArmorInBucket(
    items: DestinyItemComponent[],
    bucket: keyof typeof armorBuckets
) {
    return items.find(item => item.bucketHash === armorBuckets[bucket])
}

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
