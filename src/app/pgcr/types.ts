import type { RaidHubInstanceExtended } from "~/services/raidhub/types"

export type PGCRPageProps = {
    instanceId: string
    ssrActivity: RaidHubInstanceExtended | null
    isReady: boolean
}

export type PGCRPageParams = {
    player?: string
    character?: string
}
