import { reactDedupe } from "~/util/react-cache"
import { getRaidHubApi } from "./common"
import { type RaidHubManifestResponse } from "./types"

export const prefetchManifest = reactDedupe(async (): Promise<RaidHubManifestResponse> => {
    try {
        return await getRaidHubApi("/manifest", null, null, {
            next: { revalidate: 300 }
        }).then(res => res.response)
    } catch (e) {
        console.error("Failed to prefetch raidhub manifest", e)
        throw e
    }
})
