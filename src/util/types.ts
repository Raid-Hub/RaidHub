import { Collection } from "@discordjs/collection"
import {
    BungieMembershipType,
    DestinyHistoricalStatsPeriodGroup,
    DestinyProfileComponent,
    GroupV2
} from "oodestiny/schemas"
import { Raid } from "./raid"
import { Tag } from "./tags"

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
    membershipType: BungieMembershipType
    membershipId: string
}
