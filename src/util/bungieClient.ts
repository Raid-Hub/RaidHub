import { Clan, ProfileComponent, RGBA } from "./types"
import { CharacterName } from "./characters"
import { RGBAToHex } from "./formatting"
import {
    BungieMembershipType,
    DestinyActivityModeType,
    DestinyAggregateActivityResults,
    DestinyCharacterComponent,
    DestinyClass,
    DestinyComponentType,
    DestinyHistoricalStatsAccountResult,
    DestinyHistoricalStatsPeriodGroup,
    DestinyPostGameCarnageReportData,
    DestinyPostGameCarnageReportEntry,
    GroupType,
    GroupsForMemberFilter,
    PlatformErrorCodes,
    UserInfoCard,
    UserSearchResponseDetail
} from "bungie-net-core/lib/models"
import {
    getActivityHistory,
    getCharacter,
    getDestinyAggregateActivityStats,
    getHistoricalStatsForAccount,
    getLinkedProfiles,
    getPostGameCarnageReport,
    getProfile,
    searchDestinyPlayerByBungieName
} from "bungie-net-core/lib/endpoints/Destiny2"
import { getGroupsForMember } from "bungie-net-core/lib/endpoints/GroupV2"
import { searchByGlobalNamePost } from "bungie-net-core/lib/endpoints/User"

// TODO: move these to a CDN
// @ts-ignore
import EmblemsJson from "./destiny-definitions/emblems.json" assert { type: "json" }
// @ts-ignore
import BannersJson from "./destiny-definitions/clanBanner.json" assert { type: "json" }
import CustomError from "../models/errors/CustomError"

const emblems: { [hash: string]: string } = EmblemsJson
const defaultEmblem = "/common/destiny2_content/icons/1740254cb1bb978b2c7f0f3d03f58c6b.jpg"

const clanBanners: {
    clanBannerDecals: {
        [hash: string]: {
            foregroundPath: string
            backgroundPath: string
        }
    }
    clanBannerDecalPrimaryColors: { [hash: string]: RGBA }
    clanBannerDecalSecondaryColors: { [hash: string]: RGBA }
    clanBannerGonfalons: { [hash: string]: string }
    clanBannerGonfalonColors: { [hash: string]: RGBA }
    clanBannerGonfalonDetails: { [hash: string]: string }
    clanBannerGonfalonDetailColors: { [hash: string]: RGBA }
    clanBannerDecalsSquare: {
        [hash: string]: {
            foregroundPath: string
            backgroundPath: string
        }
    }
    clanBannerGonfalonDetailsSquare: { [hash: string]: string }
} = BannersJson

export const ACTIVITIES_PER_PAGE = 250

/**
 * This class acts as the main interaction with the BungieAPI. Add methods to this class to add
 */
export default class BungieNetClient {
    private access_token?: string = undefined

    login(access_token: string) {
        this.access_token = access_token
    }

    logout() {
        this.access_token = undefined
    }

    async getPGCR(activityId: string): Promise<DestinyPostGameCarnageReportData> {
        try {
            const res = await getPostGameCarnageReport({ activityId })
            return {
                ...res.Response,
                entries: res.Response.entries.filter(entry => !nonParticipant(entry))
            }
        } catch (e: any) {
            if (e.ErrorCode === PlatformErrorCodes.SystemDisabled)
                throw Error("The Bungie.net API is currently down for maintence.")
            else if (e.ErrorCode === PlatformErrorCodes.ParameterParseFailure)
                throw Error(`Invalid Activity ID [${activityId}]`)
            throw e
        }
    }

    async getCharacterEmblem(
        characterId: string,
        destinyMembershipId: string,
        membershipType: BungieMembershipType
    ): Promise<string> {
        let rv: string = defaultEmblem
        try {
            const res = await getCharacter({
                characterId,
                destinyMembershipId,
                membershipType,
                components: [DestinyComponentType.Characters]
            })
            const data = res.Response.character.data
            if (data) {
                rv = emblemFromHash(data.emblemHash)
            }
        } catch (e) {
            // TODO record errors
        } finally {
            return `https://bungie.net${rv}`
        }
    }

    async getActivityHistory(
        destinyMembershipId: string,
        characterId: string,
        membershipType: BungieMembershipType,
        page: number
    ): Promise<DestinyHistoricalStatsPeriodGroup[]> {
        try {
            const res = await getActivityHistory({
                characterId,
                destinyMembershipId,
                membershipType,
                page,
                mode: DestinyActivityModeType.Raid,
                count: ACTIVITIES_PER_PAGE
            })
            return res.Response.activities ?? []
        } catch (e: any) {
            if (e.ErrorCode === PlatformErrorCodes.SystemDisabled)
                throw Error("The Bungie.net API is currently down for maintence.")
            throw e
        }
    }

    async getClan(
        membershipId: string,
        membershipType: BungieMembershipType
    ): Promise<Clan | null> {
        try {
            const res = await getGroupsForMember({
                filter: GroupsForMemberFilter.All,
                groupType: GroupType.Clan,
                membershipId,
                membershipType
            })
            const clan = res.Response.results[0]
            if (!clan) return null
            const group = clan.group
            const clanBannerData = group.clanInfo.clanBannerData
            return {
                ...group,
                clanBanner: {
                    decalPrimaryColor: RGBAToHex(
                        clanBanners.clanBannerDecalPrimaryColors[clanBannerData.decalColorId]
                    ),
                    decalSecondaryColor: RGBAToHex(
                        clanBanners.clanBannerDecalSecondaryColors[
                            clanBannerData.decalBackgroundColorId
                        ]
                    ),
                    decalPrimary:
                        clanBanners.clanBannerDecalsSquare[clanBannerData.decalId].foregroundPath,
                    decalSecondary:
                        clanBanners.clanBannerDecalsSquare[clanBannerData.decalId].backgroundPath,
                    gonfalcons: clanBanners.clanBannerGonfalons[clanBannerData.gonfalonId],
                    gonfalconsColor: RGBAToHex(
                        clanBanners.clanBannerGonfalonColors[clanBannerData.gonfalonColorId]
                    ),
                    decalTopColor: RGBAToHex(
                        clanBanners.clanBannerGonfalonDetailColors[
                            clanBannerData.gonfalonDetailColorId
                        ]
                    ),
                    decalTop:
                        clanBanners.clanBannerGonfalonDetailsSquare[clanBannerData.gonfalonDetailId]
                }
            }
        } catch (e: any) {
            if (e.ErrorCode === PlatformErrorCodes.SystemDisabled)
                throw Error("The Bungie.net API is currently down for maintence.")
            throw e
        }
    }

    async getBungieNextMembership(
        membershipId: string,
        membershipType: BungieMembershipType
    ): Promise<UserInfoCard | undefined> {
        try {
            const res = await getLinkedProfiles({
                membershipId,
                membershipType
            })
            return res.Response.bnetMembership
        } catch (e: any) {
            if (e.ErrorCode === PlatformErrorCodes.SystemDisabled)
                throw Error("The Bungie.net API is currently down for maintence.")
            throw e
        }
    }

    async searchForUser(username: string): Promise<UserSearchResponseDetail[]> {
        try {
            const response = await searchByGlobalNamePost(
                {
                    page: 0
                },
                {
                    displayNamePrefix: username
                }
            )
            return response.Response.searchResults
        } catch (e: any) {
            if (e.ErrorCode === PlatformErrorCodes.SystemDisabled)
                throw Error("The Bungie.net API is currently down for maintence.")
            throw e
        }
    }

    async getFirstCharacter({
        membershipId: destinyMembershipId,
        membershipType
    }: {
        membershipId: string
        membershipType: BungieMembershipType
    }): Promise<DestinyCharacterComponent | null> {
        try {
            const res = await getProfile({
                destinyMembershipId,
                membershipType,
                components: [DestinyComponentType.Characters]
            })
            if (!res.Response.characters.data) {
                throw new Error("Private profile")
            } else {
                const characters = res.Response.characters.data
                return Object.values(characters)[0]
            }
        } catch (e: any) {
            if (e.ErrorCode === PlatformErrorCodes.SystemDisabled)
                throw Error("The Bungie.net API is currently down for maintence.")
            throw e
        }
    }

    async searchByBungieName(displayName: string, displayNameCode: number): Promise<UserInfoCard> {
        try {
            const response = await searchDestinyPlayerByBungieName(
                {
                    membershipType: BungieMembershipType.All
                },
                {
                    displayName,
                    displayNameCode
                }
            )
            return response.Response.filter(
                user => !user.crossSaveOverride || user.membershipType === user.crossSaveOverride
            )[0]
        } catch (e: any) {
            if (e.ErrorCode === PlatformErrorCodes.SystemDisabled)
                throw Error("The Bungie.net API is currently down for maintence.")
            throw e
        }
    }

    async validatePGCR(
        pgcr: DestinyPostGameCarnageReportData
    ): Promise<DestinyPostGameCarnageReportData> {
        const validatedEntries = await Promise.all(
            pgcr.entries.map(async entry => {
                const info = entry.player.destinyUserInfo
                if (!info.membershipType) {
                    let found: BungieMembershipType = BungieMembershipType.None
                    let newInfo: UserInfoCard
                    let newClassInfo: {
                        classType: DestinyClass
                        classHash: number
                        characterClass: string
                    }

                    const possibleTypes = [
                        BungieMembershipType.TigerPsn,
                        BungieMembershipType.TigerXbox,
                        BungieMembershipType.TigerSteam,
                        BungieMembershipType.TigerEgs,
                        BungieMembershipType.TigerStadia,
                        BungieMembershipType.TigerDemon,
                        BungieMembershipType.TigerBlizzard
                    ]

                    for (const type of possibleTypes) {
                        try {
                            const profile = await getProfile({
                                destinyMembershipId: info.membershipId,
                                membershipType: type,
                                components: [
                                    DestinyComponentType.Profiles,
                                    DestinyComponentType.Characters
                                ]
                            })
                            newInfo = profile.Response.profile.data?.userInfo
                            const classInfo = profile.Response.characters.data?.[entry.characterId]
                            newClassInfo = {
                                ...classInfo,
                                characterClass: CharacterName[classInfo.classType]
                            }
                            found = newInfo.crossSaveOverride || type
                            newInfo = { ...newInfo, membershipType: found }
                            break
                        } catch {
                            continue
                        }
                    }
                    if (found) {
                        return {
                            ...entry,
                            player: {
                                ...entry.player,
                                ...newClassInfo!,
                                destinyUserInfo: {
                                    ...info,
                                    ...newInfo!
                                }
                            }
                        }
                    }
                }
                return entry
            })
        )
        return { ...pgcr, entries: validatedEntries }
    }

    async getProfileStats({
        destinyMembershipId,
        membershipType
    }: {
        destinyMembershipId: string
        membershipType: BungieMembershipType
    }): Promise<DestinyHistoricalStatsAccountResult> {
        try {
            const stats = await getHistoricalStatsForAccount({
                destinyMembershipId,
                membershipType
            })
            return stats.Response
        } catch (e: any) {
            if (e.ErrorCode === PlatformErrorCodes.SystemDisabled)
                throw Error("The Bungie.net API is currently down for maintence.")
            throw e
        }
    }

    async getCharacterStats({
        destinyMembershipId,
        membershipType,
        characterId
    }: {
        destinyMembershipId: string
        membershipType: BungieMembershipType
        characterId: string
    }): Promise<DestinyAggregateActivityResults> {
        try {
            const stats = await getDestinyAggregateActivityStats({
                characterId,
                destinyMembershipId,
                membershipType
            })
            return stats.Response
        } catch (e: any) {
            if (e.ErrorCode === PlatformErrorCodes.SystemDisabled)
                throw Error("The Bungie.net API is currently down for maintence.")
            throw e
        }
    }
}

/**
 * Determines if an entry was a non-participant in the raid
 * @param entry The entry to determine to ensure
 * @returns
 */
function nonParticipant(entry: DestinyPostGameCarnageReportEntry): boolean {
    return (
        entry.values.timePlayedSeconds?.basic.value <= 25 &&
        entry.values.kills?.basic.value === 0 &&
        entry.values.deaths?.basic.value === 0
    )
}

function emblemFromHash(hash: number) {
    return emblems[hash] ?? defaultEmblem
}
