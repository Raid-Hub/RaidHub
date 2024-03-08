import { getRaidHubApi } from "./common"
import { type RaidHubManifest } from "./types"

export const prefetchManifest = async (): Promise<RaidHubManifest> => {
    try {
        return await getRaidHubApi("/manifest", null, null, {
            next: { revalidate: 300 }
        })
    } catch (e) {
        console.error("Failed to prefetch raidhub manifest", e)
        throw e
    }
}
