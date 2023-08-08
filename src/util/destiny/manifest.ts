import { getClanBannerSource } from "bungie-net-core/lib/endpoints/Destiny2"
import { BungieClientProtocol } from "bungie-net-core/lib/client"
import { getDestinyInventoryItems } from "../../services/bungie/getDestinyInventoryItems"
import {
    ClanBannerSource,
    DestinyInventoryItemDefinition,
    DestinyManifest
} from "bungie-net-core/lib/models"
import { DestinyManifestComponent, DestinyManifestLanguage } from "bungie-net-core/lib/manifest"
import { Hashed, indexDB } from "../dexie"

export type CachedEmblem = {
    banner: string
}

export type CachedWeapon = {
    name: string
    icon: string
    type: string
}

export type RGBA = {
    blue: number
    green: number
    red: number
    alpha: number
}

export interface RawClanBannerData extends ClanBannerSource {
    clanBannerDecals: {
        [hash: string]: {
            foregroundPath: string
            backgroundPath: string
        }
    }
    clanBannerDecalPrimaryColors: { [hash: string]: RGBA }
    clanBannerDecalSecondaryColors: { [hash: string]: RGBA }
    clanBannerGonfalons: { [hash: string]: string }
    clanBannerGonfalonColors: { [hash: string]: RGBA }
    clanBannerGonfalonDetails: { [hash: string]: string }
    clanBannerGonfalonDetailColors: { [hash: string]: RGBA }
    clanBannerDecalsSquare: {
        [hash: string]: {
            foregroundPath: string
            backgroundPath: string
        }
    }
    clanBannerGonfalonDetailsSquare: { [hash: string]: string }
}

export async function updateCachedManifest({
    client,
    manifest,
    language
}: {
    client: BungieClientProtocol
    manifest: DestinyManifest
    language: DestinyManifestLanguage
}) {
    await Promise.all([
        getDestinyInventoryItems({
            manifest,
            language
        }).then(items =>
            Promise.all([
                indexDB.weapons.bulkPut(processWeapons(items)),
                indexDB.emblems.bulkPut(processEmblems(items))
            ])
        ),

        getClanBannerSource(client)
            .then(res => res.Response as RawClanBannerData)
            .then(banners => {
                const hash = <K extends keyof RawClanBannerData>(
                    key: K
                ): Hashed<
                    RawClanBannerData[K][string] extends string
                        ? { value: string }
                        : RawClanBannerData[K][string]
                >[] =>
                    Object.entries(banners[key]).map(([hash, def]) =>
                        typeof def === "string" ? { hash, value: def } : { hash, ...def }
                    )
                return Promise.all([
                    indexDB.clanBannerDecals.bulkPut(hash("clanBannerDecals")),
                    indexDB.clanBannerDecalPrimaryColors.bulkPut(
                        hash("clanBannerDecalPrimaryColors")
                    ),
                    indexDB.clanBannerDecalSecondaryColors.bulkPut(
                        hash("clanBannerDecalSecondaryColors")
                    ),
                    indexDB.clanBannerGonfalons.bulkPut(hash("clanBannerGonfalons")),
                    indexDB.clanBannerGonfalonColors.bulkPut(hash("clanBannerGonfalonColors")),
                    indexDB.clanBannerGonfalonDetails.bulkPut(hash("clanBannerGonfalonDetails")),
                    indexDB.clanBannerGonfalonDetailColors.bulkPut(
                        hash("clanBannerGonfalonDetailColors")
                    ),
                    indexDB.clanBannerDecalsSquare.bulkPut(hash("clanBannerDecalsSquare")),
                    indexDB.clanBannerGonfalonDetailsSquare.bulkPut(
                        hash("clanBannerGonfalonDetailsSquare")
                    )
                ])
            })
    ])
}

function processWeapons(items: DestinyManifestComponent<DestinyInventoryItemDefinition>) {
    const weaponBuckets = [/* kinetic */ 1498876634, /* energy */ 2465295065, /* power */ 953998645]
    return Object.entries(items)
        .filter(([_, def]) => weaponBuckets.includes(def.inventory?.bucketTypeHash!))
        .map(
            ([hash, def]) =>
                ({
                    hash,
                    name: def.displayProperties.name,
                    icon: def.displayProperties.icon,
                    type: def.itemTypeDisplayName ?? "Classified"
                } as Hashed<CachedWeapon>)
        )
}

function processEmblems(items: DestinyManifestComponent<DestinyInventoryItemDefinition>) {
    return Object.entries(items)
        .filter(([_, def]) => def.itemTypeDisplayName === "Emblem")
        .map(([hash, def]) => ({ hash, banner: def.secondarySpecial } as Hashed<CachedEmblem>))
}
