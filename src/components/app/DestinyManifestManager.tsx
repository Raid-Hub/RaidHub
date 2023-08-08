import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { CachedEmblem, CachedWeapon, updateCachedManifest } from "../../util/destiny/manifest"
import { useBungieClient } from "./TokenManager"
import { getDestinyManifest } from "bungie-net-core/lib/endpoints/Destiny2"
import { useLocale } from "./LocaleManager"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useLiveQuery } from "dexie-react-hooks"
import { indexDB } from "../../util/dexie"
import { ClanBanner } from "bungie-net-core/lib/models"
import { ClanBannerData, resolveClanBanner } from "../../util/destiny/clanBanner"

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

export function useEmblem(hash: string): CachedEmblem | null {
    const manifestVersion = useManifestVersion()

    const emblem = useLiveQuery(() => indexDB.emblems.get({ hash }), [hash, manifestVersion])
    console.log(emblem)

    return emblem ?? null
}

export function useWeapon(hash: string | null): CachedWeapon | null {
    const manifestVersion = useManifestVersion()
    const weapon = useLiveQuery(
        () => (hash ? indexDB.weapons.get({ hash }) : undefined),
        [hash, manifestVersion]
    )

    return weapon ?? null
}

export function useClanBanner(banner: ClanBanner | null): ClanBannerData | null {
    const manifestVersion = useManifestVersion()

    const clanBanners = useLiveQuery(
        () => (banner ? resolveClanBanner(banner) : null),
        [banner, manifestVersion]
    )

    return clanBanners ?? null
}
