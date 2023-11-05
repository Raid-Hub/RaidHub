import { ReactNode, createContext, useContext } from "react"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"
import { createHeaders } from "~/services/raidhub/createHeaders"
import { RaidHubAPIResponse } from "~/types/raidhub-api"
import { Difficulty, ListedRaid } from "~/types/raids"
import { getRaidHubBaseUrl } from "~/util/raidhub/getRaidHubUrl"

type RaidHubManifest = {
    raids: Record<ListedRaid, string>
    difficulties: Record<Difficulty, string>
    hashes: Record<
        string,
        {
            raid: ListedRaid
            difficulty: Difficulty
        }
    >
    listed: ListedRaid[]
    sunset: ListedRaid[]
    contest: ListedRaid[]
    master: ListedRaid[]
    prestige: ListedRaid[]
    reprisedChallengePairings: {
        raid: ListedRaid
        difficulty: Difficulty
    }[]
    activityLeaderboards: Record<ListedRaid, Record<string, string>>
    worldFirstBoards: Record<ListedRaid, string>
}

const ManifestContext = createContext<RaidHubManifest | null | undefined>(undefined)

const getManifest = () =>
    fetch(getRaidHubBaseUrl() + "/manifest", { headers: createHeaders() })
        .then(res => res.json())
        .then((data: RaidHubAPIResponse<RaidHubManifest>) => (data.success ? data.response : null))

export function RaidHubManifestManager({ children }: { children: ReactNode }) {
    const { value: manifest } = useLocalStorage<RaidHubManifest | null>(
        "raidhub_manifest",
        null,
        getManifest
    )
    return <ManifestContext.Provider value={manifest}>{children}</ManifestContext.Provider>
}

export function useRaidHubManifest() {
    const manifest = useContext(ManifestContext)
    if (manifest === undefined)
        throw new Error("Cannot use RaidHub manifest context outside of the provider")

    return manifest
}
