"use client"

import { useQuery } from "@tanstack/react-query"
import { getDestinyManifest } from "bungie-net-core/endpoints/Destiny2"
import { useEffect, useState, type ReactNode } from "react"
import { DB_VERSION } from "~/util/dexie"
import { type BungieAPIError } from "../../../models/BungieAPIError"
import { updateCachedManifest } from "../../../util/destiny/manifest"
import { useLocale } from "./LocaleManager"
import { useBungieClient } from "./session/BungieClientProvider"

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
                    .then(() => {
                        setManifestVersion(newManifestVersion)
                        localStorage.setItem(KEY_MANIFEST_VERSION, newManifestVersion)
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
