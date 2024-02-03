import { getDestinyManifest } from "bungie-net-core/endpoints/Destiny2"
import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { useBungieClient } from "../../app/managers/BungieTokenManager"
import { useLocale } from "../../app/managers/LocaleManager"
import { updateCachedManifest } from "../../util/destiny/manifest"

const KEY_MANIFEST_VERSION = "manifest_version"

// edit this value if you change anything about the stored values
const MANIFEST_VERSION_ID = "2"

const DestinyManifestContext = createContext<string>("")

export const DestinyManifestManager = ({ children }: { children: ReactNode }) => {
    const [manifestVersion, setManifestVersion] = useState("null")
    const client = useBungieClient()
    const { manifestLanguage } = useLocale()

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
                if (oldVersion !== currentVersion) {
                    await updateCachedManifest({
                        client,
                        manifest,
                        language: manifestLanguage
                    }).then(() => localStorage.setItem(KEY_MANIFEST_VERSION, currentVersion))
                }
                setManifestVersion(currentVersion)
            })
            .catch(e => {
                console.error(
                    `Failed to download Destiny 2 manifest: ${e.message} ${
                        oldVersion ? "Using cached version." : "No cached version available."
                    }`
                )
            })
    }, [manifestLanguage, client])

    return (
        <DestinyManifestContext.Provider value={manifestVersion}>
            {children}
        </DestinyManifestContext.Provider>
    )
}

const useManifestVersion = () => useContext(DestinyManifestContext)
