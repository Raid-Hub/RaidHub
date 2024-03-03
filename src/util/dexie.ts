/**
 * @fileoverview This file contains the definition of a custom Dexie class and utility functions for querying data from the Dexie database.
 * @module util/dexie
 */

import { Collection } from "@discordjs/collection"
import type {
    DestinyActivityDefinition,
    DestinyActivityModeDefinition,
    DestinyActivityModifierDefinition,
    DestinyClassDefinition,
    DestinyInventoryItemDefinition,
    DestinyMilestoneDefinition,
    DestinySeasonDefinition
} from "bungie-net-core/models"
import Dexie, { type Table } from "dexie"
import { useLiveQuery } from "dexie-react-hooks"
import { useMemo } from "react"
import type { RGBA } from "~/app/layout/managers/DestinyManifestManager"
import { o } from "./o"

/**
 * The version of the Dexie database.
 */
export const DB_VERSION = 9

/**
 * The list of table names in the Dexie database.
 */
const tables = [
    "items",
    "activities",
    "activityModes",
    "activityModifiers",
    "seasons",
    "characterClasses",
    "milestones",
    "clanBannerDecalPrimaryColors",
    "clanBannerDecalSecondaryColors",
    "clanBannerDecals",
    "clanBannerDecalsSquare",
    "clanBannerGonfalonColors",
    "clanBannerGonfalonDetailColors",
    "clanBannerGonfalonDetails",
    "clanBannerGonfalonDetailsSquare",
    "clanBannerGonfalons"
] as const

/**
 * Represents the Dexie tables.
 */
type Tables = Readonly<
    Record<
        (typeof tables)[number],
        Table<{
            hash: number
        }>
    >
>

/**
 * Represents an object with a hash property.
 */
type Hashed<T> = { hash: number } & T

/**
 * Represents the paths for the foreground and background clan banner images.
 */
type ForegroundBackground = {
    foregroundPath: string
    backgroundPath: string
}

/**
 * Custom Dexie class that extends the Dexie class and implements the Tables interface.
 */
class CustomDexie extends Dexie implements Tables {
    items!: Table<DestinyInventoryItemDefinition>
    activities!: Table<DestinyActivityDefinition>
    activityModes!: Table<DestinyActivityModeDefinition>
    activityModifiers!: Table<DestinyActivityModifierDefinition>
    seasons!: Table<DestinySeasonDefinition>
    characterClasses!: Table<DestinyClassDefinition>
    milestones!: Table<Hashed<DestinyMilestoneDefinition>>
    clanBannerDecalPrimaryColors!: Table<Hashed<RGBA>>
    clanBannerDecalSecondaryColors!: Table<Hashed<RGBA>>
    clanBannerDecals!: Table<Hashed<ForegroundBackground>>
    clanBannerDecalsSquare!: Table<Hashed<ForegroundBackground>> // unused
    clanBannerGonfalonColors!: Table<Hashed<RGBA>>
    clanBannerGonfalonDetailColors!: Table<Hashed<RGBA>>
    clanBannerGonfalonDetails!: Table<Hashed<{ value: string }>>
    clanBannerGonfalonDetailsSquare!: Table<Hashed<{ value: string }>> // unused
    clanBannerGonfalons!: Table<Hashed<{ value: string }>>

    /**
     * The cache object that stores collections of data from each table.
     */
    public readonly cache: {
        [K in (typeof tables)[number]]: Collection<
            number,
            CustomDexie[K] extends Table<infer T> ? T : never
        >
    }

    constructor() {
        super("app")
        this.version(DB_VERSION).stores(
            o.fromEntries(tables.map(table => [table, "hash"] as const))
        )
        // @ts-expect-error generic is right
        this.cache = o.fromEntries(tables.map(table => [table, new Collection()]))
    }
}

export const indexDB = new CustomDexie()

/**
 * Custom hook for querying a single item from the Dexie database with in-memory caching.
 * @param table - The name of the table to query.
 * @param hash - The hash of the item to query.
 * @returns The queried item or null if not found.
 */
export const useDexieGetQuery = <K extends (typeof tables)[number]>(table: K, hash: number) => {
    const liveQuery = useLiveQuery(
        () =>
            // @ts-expect-error generic is right
            indexDB[table].get({ hash: hash }),
        [hash]
    )

    return useMemo(() => {
        if (liveQuery) {
            indexDB.cache[table].set(
                liveQuery.hash,
                // @ts-expect-error item is right type
                liveQuery
            )
        }
        return (
            (indexDB.cache[table].get(hash) as ReturnType<CustomDexie["cache"][K]["get"]>) ?? null
        )
    }, [table, liveQuery, hash])
}

/**
 * Custom hook for querying multiple items from the Dexie database with in-memory caching.
 * @param table - The name of the table to query.
 * @param hashes - The hashes of the items to query.
 * @returns The queried items.
 */
export const useDexieBulkGetQuery = <K extends (typeof tables)[number]>(
    table: K,
    hashes: number[]
) => {
    const liveQuery = useLiveQuery(
        () =>
            // @ts-expect-error generic is right
            indexDB[table].bulkGet(hashes),
        [hashes]
    )

    return useMemo(() => {
        liveQuery?.forEach(item => {
            if (item)
                indexDB.cache[table].set(
                    item.hash,
                    // @ts-expect-error item is right type
                    item
                )
        })

        return indexDB.cache[table].filter(item =>
            // @ts-expect-error hash is a number
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            hashes.includes(item.hash)
        )
    }, [hashes, table, liveQuery])
}
