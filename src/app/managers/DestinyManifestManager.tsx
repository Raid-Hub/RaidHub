"use client"

import { useQuery } from "@tanstack/react-query"
import { getDestinyManifest } from "bungie-net-core/endpoints/Destiny2"
import { DestinyManifest } from "bungie-net-core/models"
import { ReactNode, useEffect, useState } from "react"
import { type BungieAPIError } from "../../models/BungieAPIError"
import { updateCachedManifest } from "../../util/destiny/manifest"
import { useBungieClient } from "./BungieTokenManager"
import { useLocale } from "./LocaleManager"

const KEY_MANIFEST_VERSION = "manifest_version"

// edit this value if you change anything about *how* the manifest is stored to force a cache refresh when
// the changes are deployed
const MANIFEST_VERSION_ID = "2"

export const DestinyManifestManager = ({ children }: { children: ReactNode }) => {
    const [manifestVersion, setManifestVersion] = useState<string | null>(null)
    const client = useBungieClient()
    const { manifestLanguage } = useLocale()

    useQuery({
        queryKey: ["bungie", "manifest", manifestLanguage],
        queryFn: () => getDestinyManifest(client).then(res => res.Response),
        staleTime: 3600_000, // 1 hour
        onSuccess: async data => {
            const newManifestVersion = [data.version, manifestLanguage, MANIFEST_VERSION_ID].join(
                "-"
            )

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

    useEffect(() => {
        const oldVersion = localStorage.getItem(KEY_MANIFEST_VERSION)
        if (oldVersion) setManifestVersion(oldVersion)

        getDestinyManifest(client)
            .then(async ({ Response: manifest }) => {
                const currentVersion = [
                    manifest.version,
                    manifestLanguage,
                    MANIFEST_VERSION_ID
                ].join("-")
            })
            .catch(e => {})
    }, [manifestLanguage, client])

    return <>{children}</>
}
