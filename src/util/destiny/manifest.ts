import { BungieClientProtocol } from "bungie-net-core"
import { Hashed, indexDB } from "../dexie"
import { ClanBannerSource, DestinyManifest } from "bungie-net-core/models"
import { DestinyManifestLanguage, getDestinyManifestComponent } from "bungie-net-core/manifest"
import { getClanBannerSource } from "bungie-net-core/endpoints/Destiny2"

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
        getDestinyManifestComponent(client, {
            destinyManifest: manifest,
            tableName: "DestinyInventoryItemLiteDefinition",
            language: language
        }).then(items =>
            indexDB.transaction("rw", indexDB.items, () =>
                indexDB.items.bulkPut(
                    Object.entries(items).map(([hash, item]) => ({ ...item, hash: Number(hash) }))
                )
            )
        ),

        getDestinyManifestComponent(client, {
            destinyManifest: manifest,
            tableName: "DestinyActivityDefinition",
            language: language
        }).then(items =>
            indexDB.transaction("rw", indexDB.activities, () =>
                indexDB.activities.bulkPut(Object.values(items))
            )
        ),

        getDestinyManifestComponent(client, {
            destinyManifest: manifest,
            tableName: "DestinyActivityModeDefinition",
            language: language
        }).then(items =>
            indexDB.transaction("rw", indexDB.activityModes, () =>
                indexDB.activityModes.bulkPut(Object.values(items))
            )
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
                        typeof def === "string"
                            ? { hash: Number(hash), value: def }
                            : { hash: Number(hash), ...def }
                    )

                const clanBannerTableKeys = Object.keys(banners) as (keyof RawClanBannerData)[]

                return indexDB.transaction(
                    "rw",
                    clanBannerTableKeys.map(key => indexDB[key]),
                    () =>
                        Promise.all(
                            clanBannerTableKeys.map(key => {
                                const data = hash(key)
                                return (
                                    indexDB[key]
                                        // @ts-expect-error
                                        .bulkPut(data)
                                )
                            })
                        )
                )
            })
    ])
}
