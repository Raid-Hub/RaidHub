import { notFound } from "next/navigation"
import { type RaidHubManifestResponse } from "~/services/raidhub/types"

export const getRaidDefinition = (raid: string, manifest: RaidHubManifestResponse) => {
    return (
        Object.values(manifest.activityDefinitions).find(def => def.isRaid && def.path === raid) ??
        notFound()
    )
}
