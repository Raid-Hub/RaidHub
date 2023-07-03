import {
    BungieMembershipType,
    DestinyHistoricalStatsPeriodGroup,
    DestinyProfileComponent,
    GroupV2
} from "bungie-net-core/lib/models"
import RaidStats from "../models/profile/RaidStats"
import { Raid } from "../util/destiny/raid"
import { ClanBannerData } from "../util/destiny/clanBanner"
import { Socials } from "../util/profile/socials"
import { Collection } from "@discordjs/collection"
import { Tag } from "../util/raidhub/tags"

export type ProfileComponent = DestinyProfileComponent & {
    emblemBackgroundPath: string
}
export type InitialProfileProps = null | {
    destinyMembershipId: string
    membershipType: BungieMembershipType
}
export type AllRaidStats = Map<Raid, RaidStats>
export interface IRaidStats {
    assists: number
    totalClears: number
    deaths: number
    kills: number
    precisionKills: number
    secondsPlayed: number
    fastestClear: number
    averageClear: number
    sherpas: number
}
export type Placement = { number: number; activityId: string }
export type RaidTag = { string: string; activityId: string; flawless: boolean }
export type RaidHubProfile = {
    pinnedActivity: string | null
    socials: ProfileSocialData[]
    background: string | null
    placements: Partial<Record<Raid, Placement>>
    tags: Partial<Record<Raid, RaidTag[]>>
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
