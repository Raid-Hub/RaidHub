import { type BungieClientProtocol } from "bungie-net-core"
import { getClanBannerSource } from "bungie-net-core/endpoints/Destiny2"
import { getDestinyManifestComponent, type DestinyManifestLanguage } from "bungie-net-core/manifest"
import { type ClanBannerSource, type DestinyManifest } from "bungie-net-core/models"
import { indexDB, type Hashed } from "../dexie"

export type RGBA = {
    blue: number
    green: number
    red: number
    alpha: number
}

export interface RawClanBannerData extends ClanBannerSource {
    clanBannerDecals: Record<
        string,
        {
            foregroundPath: string
            backgroundPath: string
        }
    >
    clanBannerDecalPrimaryColors: Record<string, RGBA>
    clanBannerDecalSecondaryColors: Record<string, RGBA>
    clanBannerGonfalons: Record<string, string>
    clanBannerGonfalonColors: Record<string, RGBA>
    clanBannerGonfalonDetails: Record<string, string>
    clanBannerGonfalonDetailColors: Record<string, RGBA>
    clanBannerDecalsSquare: Record<
        string,
        {
            foregroundPath: string
            backgroundPath: string
        }
    >
    clanBannerGonfalonDetailsSquare: Record<string, string>
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
        }).then(activities =>
            indexDB.transaction("rw", indexDB.activities, () =>
                indexDB.activities.bulkPut(Object.values(activities))
            )
        ),

        getDestinyManifestComponent(client, {
            destinyManifest: manifest,
            tableName: "DestinyActivityModeDefinition",
            language: language
        }).then(modes =>
            indexDB.transaction("rw", indexDB.activityModes, () =>
                indexDB.activityModes.bulkPut(Object.values(modes))
            )
        ),

        getDestinyManifestComponent(client, {
            destinyManifest: manifest,
            tableName: "DestinySeasonDefinition",
            language: language
        }).then(seasons =>
            indexDB.transaction("rw", indexDB.seasons, () =>
                indexDB.seasons.bulkPut(Object.values(seasons))
            )
        ),

        getDestinyManifestComponent(client, {
            destinyManifest: manifest,
            tableName: "DestinyActivityModifierDefinition",
            language: language
        }).then(modifiers =>
            indexDB.transaction("rw", indexDB.activityModifiers, () =>
                indexDB.activityModifiers.bulkPut(Object.values(modifiers))
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
