import {
    getClanBannerSource,
    getDestinyManifest,
    getItem
} from "bungie-net-core/lib/endpoints/Destiny2"
import { BungieClientProtocol } from "bungie-net-core/lib/client"
import { getDestinyInventoryItems } from "../../services/bungie/getDestinyInventoryItems"
import {
    ClanBannerSource,
    DestinyInventoryItemDefinition,
    DestinyManifest
} from "bungie-net-core/lib/models"
import { DestinyManifestComponent, DestinyManifestLanguage } from "bungie-net-core/lib/manifest"

export const KEY_CLANBANNERS = "clanBanner_definitions"
export const KEY_EMBLEMS = "emblems_definitions"
export const KEY_WEAPONS = "weapons_definitions"

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
    const [items, banners] = await Promise.all([
        getDestinyInventoryItems({
            manifest,
            language
        }),
        getClanBannerSource(client).then(res => res.Response as RawClanBannerData)
    ])

    localStorage.setItem(KEY_CLANBANNERS, JSON.stringify(banners))
    localStorage.setItem(KEY_WEAPONS, JSON.stringify(processWeapons(items)))
    localStorage.setItem(KEY_EMBLEMS, JSON.stringify(processEmblems(items)))
}

function processWeapons(items: DestinyManifestComponent<DestinyInventoryItemDefinition>) {
    const weaponBuckets = [/* kinetic */ 1498876634, /* energy */ 2465295065, /* power */ 953998645]
    return Object.fromEntries(
        Object.entries(items)
            .filter(([_, def]) => weaponBuckets.includes(def.inventory?.bucketTypeHash!))
            .map(
                ([hash, def]) =>
                    [
                        hash,
                        {
                            name: def.displayProperties.name,
                            icon: def.displayProperties.icon,
                            type: def.itemTypeDisplayName ?? "Classified"
                        } as CachedWeapon
                    ] as const
            )
    )
}

function processEmblems(items: DestinyManifestComponent<DestinyInventoryItemDefinition>) {
    return Object.fromEntries(
        Object.entries(items)
            .filter(([_, def]) => def.itemTypeDisplayName === "Emblem")
            .map(([hash, def]) => [hash, { banner: def.secondarySpecial }] as const)
    )
}
