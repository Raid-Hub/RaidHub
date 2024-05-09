import { reactDedupe } from "~/util/react-cache"
import { getRaidHubApi } from "./common"
import { type RaidHubManifest } from "./types"

export const prefetchManifest = reactDedupe(async (): Promise<RaidHubManifest> => {
    try {
        return await getRaidHubApi("/manifest", null, null, {
            next: { revalidate: 300 },
            cache: "force-cache"
        }).then(res => res.response)
    } catch (e) {
        console.error("Failed to prefetch raidhub manifest", e)
        throw e
    }
})
