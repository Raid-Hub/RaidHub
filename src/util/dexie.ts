import Dexie, { Table } from "dexie"
import { CachedEmblem, CachedWeapon, RGBA } from "./destiny/manifest"

export type Hashed<T> = { hash: string } & T
type CBFB = {
    foregroundPath: string
    backgroundPath: string
}

class CustomDexie extends Dexie {
    // 'friends' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    weapons!: Table<Hashed<CachedWeapon>>
    emblems!: Table<Hashed<CachedEmblem>>
    clanBannerDecals!: Table<Hashed<CBFB>>
    clanBannerDecalPrimaryColors!: Table<Hashed<RGBA>>
    clanBannerDecalSecondaryColors!: Table<Hashed<RGBA>>
    clanBannerGonfalons!: Table<Hashed<{ value: string }>>
    clanBannerGonfalonColors!: Table<Hashed<RGBA>>
    clanBannerGonfalonDetails!: Table<Hashed<{ value: string }>>
    clanBannerGonfalonDetailColors!: Table<Hashed<RGBA>>
    clanBannerDecalsSquare!: Table<Hashed<CBFB>>
    clanBannerGonfalonDetailsSquare!: Table<Hashed<{ value: string }>>

    constructor() {
        super("app")
        this.version(1).stores({
            weapons: "hash",
            emblems: "hash",
            clanBannerDecals: "hash",
            clanBannerDecalPrimaryColors: "hash",
            clanBannerDecalSecondaryColors: "hash",
            clanBannerGonfalons: "hash",
            clanBannerGonfalonColors: "hash",
            clanBannerGonfalonDetails: "hash",
            clanBannerGonfalonDetailColors: "hash",
            clanBannerDecalsSquare: "hash",
            clanBannerGonfalonDetailsSquare: "hash"
        })
    }
}

export const indexDB = new CustomDexie()
