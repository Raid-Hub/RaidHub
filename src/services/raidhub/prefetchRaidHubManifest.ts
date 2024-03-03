import { getRaidHubApi } from "./common"
import { type RaidHubManifest } from "./types"

export const prefetchManifest = async (): Promise<RaidHubManifest> =>
    getRaidHubApi("/manifest", null, null, {
        next: { revalidate: 300 }
    })
