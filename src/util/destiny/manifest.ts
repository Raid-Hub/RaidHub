import { BungieClientProtocol } from "bungie-net-core"
import { getDestinyInventoryItems } from "../../services/bungie/getDestinyInventoryItems"
import { Hashed, indexDB } from "../dexie"
import { ClanBannerSource, DestinyManifest } from "bungie-net-core/models"
import { DestinyManifestLanguage } from "bungie-net-core/manifest"
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
        getDestinyInventoryItems({
            manifest,
            language,
            client
        }).then(items =>
            indexDB.items.clear().then(() => indexDB.items.bulkPut(Object.values(items)))
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

                const clearAndPut = async <K extends keyof RawClanBannerData>(key: K) => {
                    indexDB[key]
                        .clear()
                        .catch(e => {})
                        .then(() => {
                            // @ts-expect-error
                            indexDB[key].bulkPut(hash(key))
                        })
                }
                return Promise.all(
                    Object.keys(banners).map(table => clearAndPut(table as keyof RawClanBannerData))
                )
            })
    ])
}
