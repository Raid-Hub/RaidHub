import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { updateCachedManifest } from "../../util/destiny/manifest"
import { useBungieClient } from "./TokenManager"
import { getDestinyManifest } from "bungie-net-core/lib/endpoints/Destiny2"
import { useLocale } from "./LocaleManager"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { ClanBanner } from "bungie-net-core/lib/models"
import { resolveClanBanner } from "../../util/destiny/clanBanner"
import { useQuery } from "@tanstack/react-query"
import { indexDB } from "../../util/dexie"

const KEY_MANIFEST_VERSION = "manifest_version"

const DestinyManifestContext = createContext<string>("")

type DestinyManifestManagerProps = {
    children: ReactNode
}

const DestinyManifestManager = ({ children }: DestinyManifestManagerProps) => {
    const [manifestVersion, setManifestVersion] = useState("")
    const client = useBungieClient()
    const { language } = useLocale()

    useEffect(() => {
        const oldVersion = localStorage.getItem(KEY_MANIFEST_VERSION)
        if (oldVersion) setManifestVersion(oldVersion)
        getDestinyManifest(client)
            .then(async ({ Response: manifest }) => {
                const currentVersion = manifest.version + "-" + language
                if (oldVersion !== currentVersion) {
                    await updateCachedManifest({ client, manifest, language }).then(() =>
                        localStorage.setItem(KEY_MANIFEST_VERSION, currentVersion)
                    )
                }
                setManifestVersion(currentVersion)
            })
            .catch(e =>
                CustomError.handle(
                    () =>
                        console.error(
                            `Failed to download Destiny 2 manifest: ${e.message} ${
                                oldVersion
                                    ? "Using cached version."
                                    : "No cached version available."
                            }`
                        ),
                    e,
                    ErrorCode.Manifest
                )
            )
    }, [language, client])

    return (
        <DestinyManifestContext.Provider value={manifestVersion}>
            {children}
        </DestinyManifestContext.Provider>
    )
}

export default DestinyManifestManager

const useManifestVersion = () => useContext(DestinyManifestContext)

export function useEmblem(hash: number | null) {
    const manifestVersion = useManifestVersion()

    const fetchData = async () => (hash ? indexDB.emblems.get({ hash }) : undefined)

    const emblem = useQuery({
        queryKey: ["emblem", hash, manifestVersion],
        queryFn: () => fetchData(),
        staleTime: Infinity
    })

    return emblem
}

export function useWeapon(hash: number | null) {
    const manifestVersion = useManifestVersion()

    const fetchData = async () => (hash ? indexDB.weapons.get({ hash }) : null)

    const weapon = useQuery({
        queryKey: ["weapon", hash, manifestVersion],
        queryFn: () => fetchData(),
        staleTime: Infinity
    })

    return weapon
}

export function useClanBanner(banner: ClanBanner | null) {
    const manifestVersion = useManifestVersion()

    const clanBanners = useQuery({
        queryKey: ["clanBanner", banner, manifestVersion],
        queryFn: () => (banner ? resolveClanBanner(banner) : undefined),
        staleTime: Infinity
    })

    return clanBanners
}
