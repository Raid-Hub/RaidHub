import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import {
    CachedEmblem,
    CachedWeapon,
    KEY_CLANBANNERS,
    KEY_EMBLEMS,
    KEY_WEAPONS,
    RawClanBannerData,
    updateCachedManifest
} from "../../util/destiny/manifest"
import { useBungieClient } from "./TokenManager"
import { getDestinyManifest } from "bungie-net-core/lib/endpoints/Destiny2"
import { useLocale } from "./LanguageProvider"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"

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

export function useEmblems(): Record<string, CachedEmblem> {
    const manifestVersion = useManifestVersion()
    const [emblems, setEmblems] = useState<Record<string, CachedEmblem>>({})

    useEffect(() => {
        const fromStore = localStorage.getItem(KEY_EMBLEMS)
        fromStore && setEmblems(JSON.parse(fromStore))
    }, [manifestVersion])

    return emblems
}

export function useWeapons(): Record<string, CachedWeapon> {
    const manifestVersion = useManifestVersion()
    const [weapons, setWeapons] = useState<Record<string, CachedWeapon>>({})

    useEffect(() => {
        const fromStore = localStorage.getItem(KEY_WEAPONS)
        fromStore && setWeapons(JSON.parse(fromStore))
    }, [manifestVersion])

    return weapons
}

export function useClanBanners(): RawClanBannerData {
    const manifestVersion = useManifestVersion()
    const [clanBanners, setClanBanners] = useState<RawClanBannerData>({
        clanBannerDecals: {},
        clanBannerDecalPrimaryColors: {},
        clanBannerDecalSecondaryColors: {},
        clanBannerGonfalons: {},
        clanBannerGonfalonColors: {},
        clanBannerGonfalonDetails: {},
        clanBannerGonfalonDetailColors: {},
        clanBannerDecalsSquare: {},
        clanBannerGonfalonDetailsSquare: {}
    })

    useEffect(() => {
        const fromStore = localStorage.getItem(KEY_CLANBANNERS)
        fromStore && setClanBanners(JSON.parse(fromStore))
    }, [manifestVersion])

    return clanBanners
}
