import { getActivityHistory, getCharacter, getLinkedProfiles, getPostGameCarnageReport, getProfile } from 'oodestiny/endpoints/Destiny2'
import { getGroupsForMember } from 'oodestiny/endpoints/GroupV2'
import {
    BungieMembershipType,
    ComponentPrivacySetting,
    DestinyActivityModeType,
    DestinyClass,
    DestinyComponentType,
    DestinyHistoricalStatsPeriodGroup,
    DestinyPostGameCarnageReportData,
    DestinyPostGameCarnageReportEntry,
    GroupType,
    GroupsForMemberFilter,
    PlatformErrorCodes,
    UserInfoCard
} from 'oodestiny/schemas'
import { CacheRequest, Clan, ErrSuccess, ProfileComponent, RGBA } from '../types'

// TODO: move these to a CDN
import EmblemsJson from "../destiny-definitions/emblems.json" assert { type: "json" }
import BannersJson from "../destiny-definitions/clanBanner.json" assert { type: "json" }
import { CharacterName } from '../characters'

const emblems: { [hash: string]: string } = EmblemsJson
const defaultEmblem = "/common/destiny2_content/icons/1740254cb1bb978b2c7f0f3d03f58c6b.jpg"

const clanBanners: {
    clanBannerDecals: {
        [hash: string]: {
            foregroundPath: string
            backgroundPath: string
        }
    },
    clanBannerDecalPrimaryColors: { [hash: string]: RGBA },
    clanBannerDecalSecondaryColors: { [hash: string]: RGBA },
    clanBannerGonfalons: { [hash: string]: string },
    clanBannerGonfalonColors: { [hash: string]: RGBA },
    clanBannerGonfalonDetails: { [hash: string]: string },
    clanBannerGonfalonDetailColors: { [hash: string]: RGBA },
    clanBannerDecalsSquare: {
        [hash: string]: {
            foregroundPath: string
            backgroundPath: string
        }
    },
    clanBannerGonfalonDetailsSquare: { [hash: string]: string }
} = BannersJson

const CACHE_MINUTES = 10

export const ACTIVITIES_PER_PAGE = 250

class BungieNetClient {
    public readonly access_token: string | null;
    constructor(access_token?: string) {
        this.access_token = access_token ?? null;
    }

    async getPGCR(activityId: string): Promise<DestinyPostGameCarnageReportData> {
        try {
            const res = await getPostGameCarnageReport({ activityId })
            return {
                ...res.Response,
                entries: res.Response.entries.filter(entry => !nonParticipant(entry))
            }
        } catch (e: any) {
            if (e.ErrorCode === PlatformErrorCodes.SystemDisabled) throw Error("The Bungie.net API is currently down for maintence.")
            else if (e.ErrorCode === PlatformErrorCodes.ParameterParseFailure) throw Error(`Invalid Activity ID [${activityId}]`)
            throw Error(e.Message ?? e.message)
        }
    }

    async getCharacterEmblem(characterId: string, destinyMembershipId: string, membershipType: BungieMembershipType): Promise<string> {
        const CACHE_KEY = `getCharacterEmblem${characterId}_${destinyMembershipId}_${membershipType}`;
        const cached = BungieNetClient.hitCache<string>(CACHE_KEY)
        if (cached) return `https://bungie.net${cached}`;

        let rv: string = defaultEmblem
        try {
            const res = await getCharacter({ characterId, destinyMembershipId, membershipType, components: [DestinyComponentType.Characters] })
            const data = res.Response.character.data
            if (data) {
                rv = BungieNetClient.emblemFromHash(data.emblemHash)
            }
            BungieNetClient.setCache(CACHE_KEY, rv)
        } catch (e) {
            // TODO record errors
        } finally {
            return `https://bungie.net${rv}`
        }
    }

    async getProfile(destinyMembershipId: string, membershipType: BungieMembershipType): Promise<ErrSuccess<ProfileComponent>> {
        try {
            const res = await getProfile({ destinyMembershipId, membershipType, components: [DestinyComponentType.Profiles, DestinyComponentType.Characters] })
            if (res.Response.profile.privacy === ComponentPrivacySetting.Private
                || res.Response.characters.privacy === ComponentPrivacySetting.Private) {
                // private profile
                return { error: Error("Private profile") }
            } else {
                const profile = res.Response.profile.data
                return {
                    success: {
                        ...profile,
                        emblemBackgroundPath: Object.values(res.Response.characters.data)[0].emblemBackgroundPath
                        // TODO: find deleted character Ids
                        //characterIds: Object.keys(res.Response.characters.data)
                    }
                }
            }
        } catch (e) {
            return { error: e as Error }
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
                count: ACTIVITIES_PER_PAGE,
            })
            return res.Response.activities ?? []
        } catch (e) {
            throw e
        }
    }
    async getClan(membershipId: string, membershipType: BungieMembershipType): Promise<Clan> {
        try {
            const res = await getGroupsForMember({
                filter: GroupsForMemberFilter.All,
                groupType: GroupType.Clan,
                membershipId,
                membershipType
            })
            const group = res.Response.results[0].group
            const clanBannerData = group.clanInfo.clanBannerData
            return {
                ...group,
                clanBanner: {
                    decalPrimaryColor: RGBAToHex(clanBanners.clanBannerDecalPrimaryColors[clanBannerData.decalColorId]),
                    decalSecondaryColor: RGBAToHex(clanBanners.clanBannerDecalSecondaryColors[clanBannerData.decalBackgroundColorId]),
                    decalPrimary: clanBanners.clanBannerDecalsSquare[clanBannerData.decalId].foregroundPath,
                    decalSecondary: clanBanners.clanBannerDecalsSquare[clanBannerData.decalId].backgroundPath,
                    gonfalcons: clanBanners.clanBannerGonfalons[clanBannerData.gonfalonId],
                    gonfalconsColor: RGBAToHex(clanBanners.clanBannerGonfalonColors[clanBannerData.gonfalonColorId]),
                    decalTopColor: RGBAToHex(clanBanners.clanBannerGonfalonDetailColors[clanBannerData.gonfalonDetailColorId]),
                    decalTop: clanBanners.clanBannerGonfalonDetailsSquare[clanBannerData.gonfalonDetailId]
                }
            }
        } catch (e) {
            throw e
        }
    }

    async getBungieNextMembership(membershipId: string, membershipType: BungieMembershipType): Promise<UserInfoCard | undefined> {
        try {
            const res = await getLinkedProfiles({
                membershipId,
                membershipType
            })
            return res.Response.bnetMembership
        } catch (e) {
            throw e
        }
    }

    async validatePGCR(pgcr: DestinyPostGameCarnageReportData): Promise<DestinyPostGameCarnageReportData> {
        const validatedEntries = await Promise.all(pgcr.entries.map(async (entry) => {
            const info = entry.player.destinyUserInfo
            if (!info.membershipType) {
                let found: BungieMembershipType = BungieMembershipType.None
                let newInfo: UserInfoCard
                let newClassInfo: { classType: DestinyClass, classHash: number, characterClass: string }

                const possibleTypes = [
                    BungieMembershipType.TigerPsn,
                    BungieMembershipType.TigerXbox,
                    BungieMembershipType.TigerSteam,
                    BungieMembershipType.TigerEgs,
                    BungieMembershipType.TigerStadia,
                    BungieMembershipType.TigerDemon,
                    BungieMembershipType.TigerBlizzard,
                ]

                for (const type of possibleTypes) {
                    try {
                        const profile = await getProfile({ destinyMembershipId: info.membershipId, membershipType: type, components: [DestinyComponentType.Profiles, DestinyComponentType.Characters] })
                        newInfo = profile.Response.profile.data?.userInfo
                        const classInfo = profile.Response.characters.data?.[entry.characterId]
                        newClassInfo = { ...classInfo, characterClass: CharacterName[classInfo.classType] }
                        console.log(newClassInfo)
                        found = newInfo.crossSaveOverride || type
                        newInfo = { ...newInfo, membershipType: found }
                        break;
                    } catch {
                        continue;
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
        }))
        return { ...pgcr, entries: validatedEntries }
    }

    private static emblemFromHash(hash: number) {
        return emblems[hash] ?? defaultEmblem
    }

    /** Checks the local cache for value first */
    private static hitCache<T>(cashKey: string): T | null {
        const cachedData = localStorage.getItem(cashKey);
        if (cachedData) {
            try {
                const { timestamp, data } = JSON.parse(cachedData) as CacheRequest<T>;
                if (Date.now() - timestamp < CACHE_MINUTES * 60 * 1000) {
                    return data
                }
            } catch (e) {
                // ignore error for now
            }
        }
        return null
    }

    /** Set a key of the cache to a value */
    private static setCache<T>(cashKey: string, value: T): void {
        const dataToCache: CacheRequest<T> = { timestamp: Date.now(), data: value };
        localStorage.setItem(cashKey, JSON.stringify(dataToCache));
    }
}


/**
 * Determines if an entry was a non-participant in the raid
 * @param entry The entry to determine to ensure 
 * @returns 
 */
function nonParticipant(entry: DestinyPostGameCarnageReportEntry): boolean {
    return entry.values.timePlayedSeconds?.basic.value <= 25
        && entry.values.kills?.basic.value === 0
        && entry.values.deaths?.basic.value === 0
}

function RGBAToHex(rgba: RGBA): string {
    const { red, green, blue, alpha } = rgba
    let r = red.toString(16);
    let g = green.toString(16);
    let b = blue.toString(16);
    let a = alpha.toString(16);

    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;
    if (a.length == 1)
        a = "0" + a;

    return `#${r}${g}${b}${a}`
}

export const shared = new BungieNetClient()