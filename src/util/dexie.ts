import Dexie, { Table } from "dexie"
import { CachedEmblem, CachedWeapon, RGBA } from "./destiny/manifest"

export type Hashed<T> = { hash: number } & T
type ForegroundBackground = {
    foregroundPath: string
    backgroundPath: string
}

class CustomDexie extends Dexie {
    weapons!: Table<Hashed<CachedWeapon>>
    emblems!: Table<Hashed<CachedEmblem>>
    clanBannerDecalPrimaryColors!: Table<Hashed<RGBA>>
    clanBannerDecalSecondaryColors!: Table<Hashed<RGBA>>
    clanBannerDecals!: Table<Hashed<ForegroundBackground>>
    // clanBannerDecalsSquare!: Table<Hashed<ForegroundBackground>>
    clanBannerGonfalonColors!: Table<Hashed<RGBA>>
    clanBannerGonfalonDetailColors!: Table<Hashed<RGBA>>
    clanBannerGonfalonDetails!: Table<Hashed<{ value: string }>>
    // clanBannerGonfalonDetailsSquare!: Table<Hashed<{ value: string }>>
    clanBannerGonfalons!: Table<Hashed<{ value: string }>>

    constructor() {
        super("app")
        this.version(1).stores({
            weapons: "hash",
            emblems: "hash",
            clanBannerDecalPrimaryColors: "hash",
            clanBannerDecalSecondaryColors: "hash",
            clanBannerDecals: "hash",
            // clanBannerDecalsSquare: "hash",
            clanBannerGonfalonColors: "hash",
            clanBannerGonfalonDetailColors: "hash",
            clanBannerGonfalonDetails: "hash",
            // clanBannerGonfalonDetailsSquare: "hash",
            clanBannerGonfalons: "hash"
        })
    }
}

export const indexDB = new CustomDexie()
