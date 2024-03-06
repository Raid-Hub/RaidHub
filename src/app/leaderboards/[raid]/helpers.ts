import type { ListedRaid, RaidHubManifest } from "~/services/raidhub/types"
import { o } from "~/util/o"

export const getRaidEnum = (manifest: RaidHubManifest, urlPath: string) =>
    Number(
        o
            .entries(manifest.raidUrlPaths)
            .find(([_, manifestUrlPath]) => urlPath === manifestUrlPath)![0]
    ) as ListedRaid
