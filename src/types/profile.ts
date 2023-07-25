import { Difficulty, Raid } from "./raids"
import RaidStatsCollection from "../models/profile/data/RaidStatsCollection"
import { Socials } from "../util/profile/socials"
import {
    BungieMembershipType,
    DestinyHistoricalStatsValue,
    DestinyProfileComponent,
    GroupV2
} from "bungie-net-core/lib/models"
import RaidReportDataCollection from "../models/profile/data/RaidReportDataCollection"
import { RaidReportBannerTier } from "./raidreport"
import { ClanBannerData } from "../util/destiny/clanBanner"
import Activity from "../models/profile/data/Activity"
import { FilterCallback } from "./generic"

export type ProfileComponent = DestinyProfileComponent & {
    emblemBackgroundPath: string
}
export type InitialProfileProps = {
    destinyMembershipId: string
    destinyMembershipType: BungieMembershipType
}
export type Clan = GroupV2 & { clanBanner: ClanBannerData }
export type ProfileDetails = { destinyMembershipId: string; membershipType: BungieMembershipType }
export type MembershipWithCharacters = {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    characterIds: string[]
}
export type AllRaidStats = Map<Raid, RaidStatsCollection>
export interface IRaidStats {
    assists: number
    totalClears: number
    deaths: number
    kills: number
    precisionKills: number
    secondsPlayed: number
}

export enum RankingBannerType {
    Speed,
    FullClears
}
export type RankingBannerData = {
    type: RankingBannerType
    tier: RaidReportBannerTier
    secondary: string | number
    value: number
}
export type AllRaidReportData = {
    activities: Map<Raid, RaidReportDataCollection>
    rankings: RankingBannerData[]
}
export interface RaidData<R> {
    readonly raid: Raid
    readonly difficulty: Difficulty
    readonly raw: R[]
}

export type DestinyHistoricalStatsDictionary = { [key: string]: DestinyHistoricalStatsValue }

export interface IRaidReportData {
    fastestFullClear: {
        instanceId: string
        value: number
    } | null
    flawlessTriumphActivity: IRaidReportActivity | null
    clears: number
    flawlessActivities: Map<string, IRaidReportActivity>
    lowmanActivities: Map<string, IRaidReportActivity>
    fullClears: number
    sherpaCount: number
    worldFirstPlacement: number | null
}
export type IRaidReportActivity = {
    instanceId: string
    playerCount: number
    difficulty: Difficulty
    fresh: boolean | null
}
export type LowManActivity = IRaidReportActivity & {
    flawless: boolean
}
export type SetOfLowmans = {
    lowest: LowManActivity | null
    lowestFresh: LowManActivity | null
    lowestFlawless: LowManActivity | null
}

export type Placement = { number: number; activityId: string }
export type RaidTag = {
    raid: Raid
    playerCount: number
    instanceId: string
    flawless: boolean
    fresh: boolean | null
    difficulty: Difficulty
    bestPossible: boolean
}
export type RaidHubProfile = {
    pinnedActivity: string | null
    socials: ProfileSocialData[]
    background: string | null
}

export type ProfileSocialData = {
    id: Socials
    displayName: string
    url: string
}

export type ExtendedActivity = {
    activity: Activity
    extended: {
        fresh: boolean | null
        playerCount: number
        flawless: boolean | null
    }
}

export interface ActivityFilter {
    id: string
    predicate: FilterCallback<ExtendedActivity>
    encode(): string
    deepClone(): ActivityFilter
}
