import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { updateCachedManifest } from "../../util/destiny/manifest"
import { useBungieClient } from "./TokenManager"
import { getDestinyManifest } from "bungie-net-core/endpoints/Destiny2"
import { useLocale } from "./LocaleManager"
import CustomError, { ErrorCode } from "~/models/errors/CustomError"
import { ClanBanner } from "bungie-net-core/models"
import { resolveClanBanner } from "~/util/destiny/parseClanBanner"
import { useQuery } from "@tanstack/react-query"
import { indexDB } from "~/util/dexie"

const KEY_MANIFEST_VERSION = "manifest_version"

// edit this value if you change anything about the stored values
const MANIFEST_VERSION_ID = "2"

const DestinyManifestContext = createContext<string>("")

export const DestinyManifestManager = ({ children }: { children: ReactNode }) => {
    const [manifestVersion, setManifestVersion] = useState("null")
    const client = useBungieClient()
    const { language } = useLocale()

    useEffect(() => {
        const oldVersion = localStorage.getItem(KEY_MANIFEST_VERSION)
        if (oldVersion) setManifestVersion(oldVersion)
        getDestinyManifest(client)
            .then(async ({ Response: manifest }) => {
                const currentVersion = [manifest.version, language, MANIFEST_VERSION_ID].join("-")
                if (oldVersion !== currentVersion) {
                    await updateCachedManifest({ client, manifest, language }).then(() =>
                        localStorage.setItem(KEY_MANIFEST_VERSION, currentVersion)
                    )
                }
                setManifestVersion(currentVersion)
            })
            .catch(e => {
                const ce = CustomError.handle(e, ErrorCode.Manifest)
                console.error(
                    `Failed to download Destiny 2 manifest: ${ce.message} ${
                        oldVersion ? "Using cached version." : "No cached version available."
                    }`
                )
            })
    }, [language, client])

    return (
        <DestinyManifestContext.Provider value={manifestVersion}>
            {children}
        </DestinyManifestContext.Provider>
    )
}

const useManifestVersion = () => useContext(DestinyManifestContext)

export function useItem(hash: number) {
    const manifestVersion = useManifestVersion()

    return useQuery({
        queryKey: ["item", hash, manifestVersion],
        queryFn: () => indexDB.items.get({ hash }) ?? null,
        staleTime: Infinity
    })
}

export function useActivity(hash: number) {
    const manifestVersion = useManifestVersion()

    return useQuery({
        queryKey: ["activity", hash, manifestVersion],
        queryFn: async () => (await indexDB.activities.get({ hash })) ?? null,
        staleTime: Infinity
    })
}

export function useActivityMode(hash: number) {
    const manifestVersion = useManifestVersion()

    return useQuery({
        queryKey: ["activityMode", hash, manifestVersion],
        queryFn: async () => (await indexDB.activityModes.get({ hash })) ?? null,
        staleTime: Infinity
    })
}

export function useClanBanner(banner: ClanBanner) {
    const manifestVersion = useManifestVersion()

    return useQuery({
        queryKey: ["clanBanner", banner, manifestVersion],
        queryFn: () => resolveClanBanner(banner),
        staleTime: Infinity
    })
}

export function useSeasons(opts?: { reversed?: boolean }) {
    const manifestVersion = useManifestVersion()

    return useQuery({
        queryKey: ["seasons", manifestVersion],
        queryFn: async () =>
            (await indexDB.seasons.toArray()).sort(
                (a, b) => (a.seasonNumber - b.seasonNumber) * (opts?.reversed ? -1 : 1)
            ) ?? null,
        staleTime: Infinity
    })
}
