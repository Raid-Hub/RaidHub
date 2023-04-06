import { Collection } from "@discordjs/collection";
import { DestinyHistoricalStatsPeriodGroup, GroupV2 } from "oodestiny/schemas";
import { Raid } from "./raid";
import { Tag } from "./tags";

export type ActivityCollection = Collection<string, DestinyHistoricalStatsPeriodGroup>
export type ActivityCollectionDictionary = { [key in Raid]: ActivityCollection }
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
export type FB = {
    foregroundPath: string
    backgroundPath: string
}
export type RGBA = {
    blue: number,
    green: number,
    red: number,
    alpha: number
}
export interface ClanBannerData {
    primary: RGBA,
    secondary: RGBA,
    square: FB,
    gonfalconsColor: RGBA,
    gonfalconsDetailColor: RGBA,
    gonfalconsDetail: string,
    gonfalconsLink: string
}
export type Clan = GroupV2 & { clanBanner: ClanBannerData }