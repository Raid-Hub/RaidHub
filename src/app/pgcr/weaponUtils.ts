import { Collection, type ReadonlyCollection } from "@discordjs/collection"
import type { WeaponKey } from "./types"

export const mergeWeaponCollections = (
    collections: ReadonlyCollection<number, Record<WeaponKey, number>>[]
): ReadonlyCollection<number, Record<WeaponKey, number>> =>
    collections
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
                            uniqueWeaponKills: c1.uniqueWeaponKills + c2.uniqueWeaponKills,
                            uniqueWeaponPrecisionKills:
                                c1.uniqueWeaponPrecisionKills + c2.uniqueWeaponPrecisionKills
                        }
                    })
                ),
            new Collection<number, Record<string, number>>()
        )
        .toSorted((a, b) => b.uniqueWeaponKills - a.uniqueWeaponKills)
