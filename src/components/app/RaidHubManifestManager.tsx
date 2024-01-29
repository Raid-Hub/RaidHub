import { useQuery } from "@tanstack/react-query"
import { ReactNode, createContext, useContext, useMemo } from "react"
import { getRaidHubApi } from "~/services/raidhub"
import { RaidHubManifestResponse, RaidHubRaidPath } from "~/types/raidhub-api"
import { ListedRaid } from "~/types/raids"
import manifest from "../../../manifest.json"

type ManifestContextData = {
    manifest: RaidHubManifestResponse
    urlPathForRaid(raid: ListedRaid): RaidHubRaidPath
}

const ManifestContext = createContext<ManifestContextData | undefined>(undefined)

export function RaidHubManifestManager({ children }: { children: ReactNode }) {
    const { data } = useQuery({
        queryKey: ["raidhub-manifest"],
        queryFn: () => getRaidHubApi("/manifest", null, null),
        initialData: manifest.response as RaidHubManifestResponse,
        staleTime: 1000 * 3600 // 1 hour
    })

    const value = useMemo(() => {
        return {
            manifest: data,
            urlPathForRaid(raid: ListedRaid) {
                return this.manifest.raidUrlPaths[raid]
            }
        }
    }, [data])

    return <ManifestContext.Provider value={value}>{children}</ManifestContext.Provider>
}

export function useRaidHubManifest() {
    const manifest = useContext(ManifestContext)
    if (manifest === undefined)
        throw new Error("Cannot use RaidHub manifest context outside of the provider")

    return manifest
}
