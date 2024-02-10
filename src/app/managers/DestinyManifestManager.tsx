"use client"

import { useQuery } from "@tanstack/react-query"
import { getDestinyManifest } from "bungie-net-core/endpoints/Destiny2"
import { DestinyManifest } from "bungie-net-core/models"
import { ReactNode, useEffect, useState } from "react"
import { DB_VERSION } from "~/util/dexie"
import { type BungieAPIError } from "../../models/BungieAPIError"
import { updateCachedManifest } from "../../util/destiny/manifest"
import { useLocale } from "./LocaleManager"
import { useBungieClient } from "./session/BungieClientProvider"

const KEY_MANIFEST_VERSION = "d2_manifest_version"

export const DestinyManifestManager = ({ children }: { children: ReactNode }) => {
    const [manifestVersion, setManifestVersion] = useState<string | null>(null)
    const client = useBungieClient()
    const { manifestLanguage } = useLocale()

    useQuery({
        queryKey: ["bungie", "manifest", manifestLanguage],
        queryFn: () => getDestinyManifest(client).then(res => res.Response),
        enabled: typeof navigator !== "undefined", // Wait until the language is set
        staleTime: 3600_000, // 1 hour,
        onSuccess: async data => {
            const newManifestVersion = [data.version, manifestLanguage, DB_VERSION].join("-")

            if (manifestVersion !== newManifestVersion) {
                await updateCachedManifest({
                    client,
                    manifest: data,
                    language: manifestLanguage
                })
            }

            setManifestVersion(newManifestVersion)
            localStorage.setItem(KEY_MANIFEST_VERSION, newManifestVersion)
        },
        onError: (e: BungieAPIError<DestinyManifest>) => {
            console.error(
                `Failed to download Destiny 2 manifest: ${e.Message} ${
                    manifestVersion ? "Using cached version." : "No cached version available."
                }`
            )
        }
    })

    useEffect(() => {
        const oldVersion = localStorage.getItem(KEY_MANIFEST_VERSION)
        if (oldVersion) setManifestVersion(oldVersion)
    }, [])

    return <>{children}</>
}
