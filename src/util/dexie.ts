import Dexie, { Table } from "dexie"
import { RGBA, RawClanBannerData } from "./destiny/manifest"
import {
    DestinyActivityDefinition,
    DestinyActivityModeDefinition,
    DestinyInventoryItemDefinition,
    DestinySeasonDefinition
} from "bungie-net-core/models"

export type Hashed<T> = { hash: number } & T
type ForegroundBackground = {
    foregroundPath: string
    backgroundPath: string
}

interface CustomDexieTables extends Record<keyof RawClanBannerData, Table> {
    items: Table<DestinyInventoryItemDefinition>
    activities: Table<DestinyActivityDefinition>
    activityModes: Table<DestinyActivityModeDefinition>
    seasons: Table<DestinySeasonDefinition>
    clanBannerDecalPrimaryColors: Table<Hashed<RGBA>>
    clanBannerDecalSecondaryColors: Table<Hashed<RGBA>>
    clanBannerDecals: Table<Hashed<ForegroundBackground>>
    clanBannerDecalsSquare: Table<Hashed<ForegroundBackground>> // unused
    clanBannerGonfalonColors: Table<Hashed<RGBA>>
    clanBannerGonfalonDetailColors: Table<Hashed<RGBA>>
    clanBannerGonfalonDetails: Table<Hashed<{ value: string }>>
    clanBannerGonfalonDetailsSquare: Table<Hashed<{ value: string }>> // unused
    clanBannerGonfalons: Table<Hashed<{ value: string }>>
}

class CustomDexie extends Dexie implements CustomDexieTables {
    items!: Table<DestinyInventoryItemDefinition>
    activities!: Table<DestinyActivityDefinition>
    activityModes!: Table<DestinyActivityModeDefinition>
    seasons!: Table<DestinySeasonDefinition>
    clanBannerDecalPrimaryColors!: Table<Hashed<RGBA>>
    clanBannerDecalSecondaryColors!: Table<Hashed<RGBA>>
    clanBannerDecals!: Table<Hashed<ForegroundBackground>>
    clanBannerDecalsSquare!: Table<Hashed<ForegroundBackground>> // unused
    clanBannerGonfalonColors!: Table<Hashed<RGBA>>
    clanBannerGonfalonDetailColors!: Table<Hashed<RGBA>>
    clanBannerGonfalonDetails!: Table<Hashed<{ value: string }>>
    clanBannerGonfalonDetailsSquare!: Table<Hashed<{ value: string }>> // unused
    clanBannerGonfalons!: Table<Hashed<{ value: string }>>

    constructor() {
        super("app")
        this.version(6).stores({
            items: "hash",
            activities: "hash",
            activityModes: "hash",
            seasons: "hash",
            clanBannerDecalPrimaryColors: "hash",
            clanBannerDecalSecondaryColors: "hash",
            clanBannerDecals: "hash",
            clanBannerDecalsSquare: "hash", // unused
            clanBannerGonfalonColors: "hash",
            clanBannerGonfalonDetailColors: "hash",
            clanBannerGonfalonDetails: "hash",
            clanBannerGonfalonDetailsSquare: "hash", // unused
            clanBannerGonfalons: "hash"
        } satisfies Record<keyof CustomDexieTables, "hash">)
    }
}

export const indexDB = new CustomDexie()
