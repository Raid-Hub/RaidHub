import { ValidRaidHash } from "./raids"

export type RaidReportHashSet = {
    activityHash: ValidRaidHash
    values: RaidReportPlayerValues
}
export type RaidReportPlayerValues = {
    bestPlayerCountDetails?: RaidReportLowman & {
        activePlayerCount: number
    }
    clears: number
    fastestFullClear?: {
        instanceId: string
        value: number
    }
    flawlessActivities?: RaidReportActivity[]
    flawlessDetails?: RaidReportActivity
    lowAccountCountActivities?: RaidReportLowman[]
    fullClears: number
    sherpaCount: number
    worldFirstDetails?: {
        rank: number
    }
}
export type RaidReportActivity = {
    accountCount: number
    fresh: boolean | null
    instanceId: string
}
export type RaidReportLowman = RaidReportActivity & {
    startingPhaseIndex: number
}
export enum RaidReportBannerTier {
    Bronze = "Bronze",
    Silver = "Silver",
    Gold = "Gold",
    Platinum = "Platinum",
    Diamond = "Diamond",
    Master = "Master",
    Challenger = "Challenger"
}
export type RaidReportRanking = {
    tier: RaidReportBannerTier
    value: number
    subtier?: string
    rank?: number
}
export type RaidReportPlayer = {
    activities: RaidReportHashSet[]
    clearsRank: RaidReportRanking
    speedRank: RaidReportRanking
    membershipId: string
}
export type RaidReportError = {
    error: {
        message: string
        stack: string
        name: string
    }
}
