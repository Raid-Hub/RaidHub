"use client"

import { useQuery } from "@tanstack/react-query"
import { getClanBannerSource, getDestinyManifest } from "bungie-net-core/endpoints/Destiny2"
import { getDestinyManifestComponent, type DestinyManifestLanguage } from "bungie-net-core/manifest"
import { type ClanBannerSource, type DestinyManifest } from "bungie-net-core/models"
import { useEffect, useState, type ReactNode } from "react"
import type { Prettify } from "~/types/generic"
import { DB_VERSION, indexDB } from "~/util/dexie"
import { o } from "~/util/o"
import { type BungieAPIError } from "../../../models/BungieAPIError"
import { useLocale } from "./LocaleManager"
import { useBungieClient } from "./session/BungieClientProvider"
import type ClientBungieClient from "./session/ClientBungieClient"

const KEY_MANIFEST_VERSION = "d2_manifest_version"

export const DestinyManifestManager = ({ children }: { children: ReactNode }) => {
    const [manifestVersion, setManifestVersion] = useState<string | null | undefined>(undefined)
    const client = useBungieClient()
    const { manifestLanguage } = useLocale()

    useQuery({
        queryKey: ["bungie", "manifest", manifestLanguage],
        queryFn: () => getDestinyManifest(client).then(res => res.Response),
        enabled: manifestVersion !== undefined,
        staleTime: 3600_000, // 1 hour,
        onSuccess: data => {
            const newManifestVersion = [data.version, manifestLanguage, DB_VERSION].join("-")

            if (manifestVersion !== newManifestVersion) {
                updateCachedManifest({
                    client,
                    manifest: data,
                    language: manifestLanguage
                })
                    .then(allSettled => {
                        const errors = allSettled
                            .filter((r): r is PromiseRejectedResult => r.status === "rejected")
                            .map(r => r.reason as unknown)

                        if (!errors.length) {
                            setManifestVersion(newManifestVersion)
                            localStorage.setItem(KEY_MANIFEST_VERSION, newManifestVersion)
                        } else {
                            throw errors
                        }
                    })
                    .catch(console.error)
            }
        },
        onError: (e: BungieAPIError) => {
            console.error(
                `Failed to download Destiny 2 manifest: ${e.Message} ${
                    manifestVersion ? "Using cached version." : "No cached version available."
                }`
            )
        }
    })

    useEffect(() => {
        const oldVersion = localStorage.getItem(KEY_MANIFEST_VERSION)
        setManifestVersion(oldVersion ?? null)
    }, [])

    return <>{children}</>
}

const updateCachedManifest = async ({
    client,
    manifest,
    language
}: {
    client: ClientBungieClient
    manifest: DestinyManifest
    language: DestinyManifestLanguage
}) =>
    Promise.allSettled([
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

        getDestinyManifestComponent(client, {
            destinyManifest: manifest,
            tableName: "DestinyClassDefinition",
            language: language
        }).then(classes =>
            indexDB.transaction("rw", indexDB.characterClasses, () =>
                indexDB.characterClasses.bulkPut(Object.values(classes))
            )
        ),

        getClanBannerSource(client).then(res =>
            updateClanBannerData(res.Response as RawClanBannerData)
        )
    ] as const)

async function updateClanBannerData(banners: RawClanBannerData) {
    const hash = <K extends keyof RawClanBannerData>(key: K) =>
        o.entries(banners[key]).map(([hash, def]) =>
            typeof def === "string"
                ? { hash: Number(hash), value: def }
                : {
                      hash: Number(hash),
                      ...(def as Prettify<RawClanBannerData[K][keyof RawClanBannerData[K]]>)
                  }
        )

    const clanBannerTableKeys = Object.keys(banners) as (keyof RawClanBannerData)[]

    return indexDB.transaction(
        "rw",
        clanBannerTableKeys.map(key => indexDB[key]),
        () =>
            Promise.all(
                clanBannerTableKeys.map(key => {
                    const data = hash(key)
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    return (
                        indexDB[key]
                            // @ts-expect-error Can't type this
                            .bulkPut(data)
                    )
                })
            )
    )
}

export interface RGBA {
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
