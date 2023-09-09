import Dexie, { Table } from "dexie"
import { RGBA, RawClanBannerData } from "./destiny/manifest"
import { DestinyInventoryItemDefinition } from "bungie-net-core/models"

export type Hashed<T> = { hash: number } & T
type ForegroundBackground = {
    foregroundPath: string
    backgroundPath: string
}

class CustomDexie extends Dexie implements Record<keyof RawClanBannerData, Table> {
    items!: Table<DestinyInventoryItemDefinition>
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
        this.version(2).stores({
            items: "hash",
            clanBannerDecalPrimaryColors: "hash",
            clanBannerDecalSecondaryColors: "hash",
            clanBannerDecals: "hash",
            clanBannerDecalsSquare: "hash", // unused
            clanBannerGonfalonColors: "hash",
            clanBannerGonfalonDetailColors: "hash",
            clanBannerGonfalonDetails: "hash",
            clanBannerGonfalonDetailsSquare: "hash", // unused
            clanBannerGonfalons: "hash"
        })
    }
}

export const indexDB = new CustomDexie()
