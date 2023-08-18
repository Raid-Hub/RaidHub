import { BungieMembershipType } from "bungie-net-core/lib/models"
import { Collection } from "@discordjs/collection"

export interface IPGCREntry {
    readonly membershipId: string
    readonly membershipType: BungieMembershipType
    readonly displayName: string | undefined
    readonly stats: IPGCREntryStats
    readonly didComplete: boolean
    readonly weapons: PlayerWeapons
}

export interface IPGCREntryStats {
    readonly kills: number
    readonly deaths: number
    readonly assists: number
    readonly kdr: number
    readonly kda: number
    readonly timePlayedSeconds: number
    readonly weaponKills: number
    readonly abilityKills: number
    readonly precisionKills: number
    readonly superKills: number
    // calculates a player's raw score for an activity, used to determine the MVP
    readonly score: number
}

export type WeaponStatsValues = {
    hash: number
    kills: number
    precision: number
}
export type PlayerWeapons = Collection<number, WeaponStatsValues>
