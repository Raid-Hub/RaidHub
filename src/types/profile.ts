import { Collection } from "@discordjs/collection"
import { Difficulty, Raid } from "../util/destiny/raid"
import RaidStats from "../models/profile/RaidStats"
import { Socials } from "../util/profile/socials"
import { Tag } from "../util/raidhub/tags"
import {
    BungieMembershipType,
    DestinyHistoricalStatsPeriodGroup,
    DestinyProfileComponent
} from "bungie-net-core/lib/models"
import RaidReportData from "../models/profile/RaidReportData"
import { RankingBannerData } from "../components/profile/Banners"

export type ProfileComponent = DestinyProfileComponent & {
    emblemBackgroundPath: string
}
export type InitialProfileProps = {
    destinyMembershipId: string
    membershipType: BungieMembershipType
}
export type ProfileDetails = { destinyMembershipId: string; membershipType: BungieMembershipType }
export type ProfileWithCharacters = {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    characterIds: string[]
}
export type AllRaidStats = Map<Raid, RaidStats>
export interface IRaidStats {
    assists: number
    totalClears: number
    deaths: number
    kills: number
    precisionKills: number
    secondsPlayed: number
}
export type AllRaidReportData = {
    activities: Map<Raid, RaidReportData>
    clearsRank: RankingBannerData
    speedRank: RankingBannerData
}
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
export type ActivityPlacements = Partial<Record<Tag, number>>
export type ActivityCollection = Collection<string, DestinyHistoricalStatsPeriodGroup>
export type ActivityCollectionDictionary = {
    [key in Raid]: ActivityCollection
}
export type ActivityHistory = ActivityCollectionDictionary | null
