import type { RaidHubActivityResponse } from "~/services/raidhub/types"

export type PGCRPageProps = {
    instanceId: string
    ssrActivity?: RaidHubActivityResponse
    isReady: boolean
}

export type PGCRPageParams = {
    player?: string
    character?: string
}

export type WeaponKey =
    | "uniqueWeaponKills"
    | "uniqueWeaponPrecisionKills"
    | "uniqueWeaponKillsPrecisionKills"
