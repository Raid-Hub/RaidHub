import { reactRequestDedupe } from "~/util/react-cache"
import { getRaidHubApi } from "./common"
import { type RaidHubManifestResponse } from "./types"

export const prefetchManifest = reactRequestDedupe(async (): Promise<RaidHubManifestResponse> => {
    try {
        return await getRaidHubApi("/manifest", null, null, {
            next: { revalidate: 86400, tags: ["manifest"] }
        }).then(res => res.response)
    } catch (err) {
        console.error("Failed to prefetch raidhub manifest", err)
        throw err
    }
})
