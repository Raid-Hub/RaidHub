import { Collection } from "@discordjs/collection"
import {
    BungieMembershipType,
    DestinyHistoricalStatsPeriodGroup,
    DestinyHistoricalStatsValue,
    DestinyPostGameCarnageReportExtendedData,
    DestinyProfileComponent,
    GroupV2
} from "bungie-net-core/lib/models"
import { Raid } from "./raid"
import { Tag } from "./tags"
import { Socials } from "./socials"

export type ProfileComponent = DestinyProfileComponent & {
    emblemBackgroundPath: string
}
export type ActivityCollection = Collection<string, DestinyHistoricalStatsPeriodGroup>
export type ActivityCollectionDictionary = {
    [key in Raid]: ActivityCollection
}
export type ActivityHistory = ActivityCollectionDictionary | null
export type ActivityPlacements = Partial<Record<Tag, number>>
export type EmblemDict = { [characterId: string]: string }
export type EmblemTuple = [id: string, emblem: string]
export type ErrSuccess<T> = {
    success?: T
    error?: Error
}
export interface CacheRequest<T> {
    timestamp: number
    data: T
}
export type RGBA = {
    blue: number
    green: number
    red: number
    alpha: number
}
export interface ClanBannerData {
    decalPrimary: string
    decalPrimaryColor: string
    decalSecondary: string
    decalSecondaryColor: string
    gonfalcons: string
    gonfalconsColor: string
    decalTop: string
    decalTopColor: string
}
export type Clan = GroupV2 & { clanBanner: ClanBannerData }
export type RaidHubProfile = {}
export type InitialProfileProps = {
    bungieNetProfile: ProfileComponent | null
    error: string
}
export type FilterCallbackType<T> = (value: T, index: number, array: T[]) => boolean
export type CustomBungieSearchResult = {
    bungieGlobalDisplayName: string
    bungieGlobalDisplayNameCode?: number
    displayName: string
    membershipType: BungieMembershipType
    membershipId: string
}
export enum Loading {
    FALSE,
    LOADING,
    HYDRATING
}
export type ProfileSocialData = {
    id: Socials
    displayName: string
    url: string
}
export type WeaponStatsValues = {
    kills: number
    precision: number
    name: { [language: string]: string }
    type: string
    icon: string
}
export type StatsKeys = {
    values: { [key: string]: DestinyHistoricalStatsValue }
    extended: DestinyPostGameCarnageReportExtendedData
}
export type Flatten<T> = T extends ReadonlyArray<infer U> ? U : never
export type HistoricalStatsDict<T> = {
    activityAssists: T
    activityCompletions: T
    activityDeaths: T
    activityKills: T
    activityPrecisionKills: T
    activitySecondsPlayed: T
}
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
export type X = {
    pinnedActivity: string | null
    socials: ProfileSocialData[]
    background: string | null
    placements: Partial<Record<Raid, Placement>>
    tags: Partial<Record<Raid, RaidTag[]>>
}
