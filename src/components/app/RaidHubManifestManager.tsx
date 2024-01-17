import { useQuery } from "@tanstack/react-query"
import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { getManifest, manifestQueryKey } from "~/services/raidhub/getManifest"
import { RaidHubManifest } from "~/types/raidhub-api"

const ManifestContext = createContext<RaidHubManifest | null | undefined>(undefined)

export function RaidHubManifestManager({ children }: { children: ReactNode }) {
    const [storedManifest, setStoredManifest] = useState<string | null>()
    useEffect(() => setStoredManifest(localStorage.getItem("raidhub_manifest")), [])

    const { data } = useQuery({
        queryKey: manifestQueryKey,
        queryFn: () => getManifest(),
        staleTime: 1000 * 3600, // 1 hour
        onSuccess(data) {
            localStorage.setItem("raidhub_manifest", JSON.stringify(data))
        }
    })

    return (
        <ManifestContext.Provider
            value={data ?? (storedManifest ? JSON.parse(storedManifest) : null)}>
            {children}
        </ManifestContext.Provider>
    )
}

export function useRaidHubManifest() {
    const manifest = useContext(ManifestContext)
    if (manifest === undefined)
        throw new Error("Cannot use RaidHub manifest context outside of the provider")

    return manifest
}
