import { getCharacter, getPostGameCarnageReport } from 'oodestiny/endpoints/Destiny2'
import {
    BungieMembershipType,
    DestinyClass,
    DestinyComponentType,
    DestinyPostGameCarnageReportData,
    DestinyPostGameCarnageReportEntry,
    PlatformErrorCodes
} from 'oodestiny/schemas'
import EmblemsJson from "./destiny-definitions/emblems.json" assert { type: "json" }
const emblems: { [hash: string]: string } = EmblemsJson

const defaultEmblem = "/common/destiny2_content/icons/1740254cb1bb978b2c7f0f3d03f58c6b.jpg"
const CACHE_MINUTES = 10

export type CharacterProps = {
    name: string,
    class: DestinyClass,
    emblem: string
}

type CacheRequest<T> = {
    timestamp: number
    data: T
}

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
            // TODO bad profiles actually return 0 here, maybe test 1,2,3?
            const res = await getCharacter({ characterId, destinyMembershipId, membershipType, components: [DestinyComponentType.Characters] })
            const data = res.Response.character.data
            if (data) {
                rv = BungieNetClient.emblemFromHash(data.emblemHash)
            }
            BungieNetClient.setCache(CACHE_KEY, rv)
        } catch (e) {
            // TODO handle errors
            throw(e)
        }
        return `https://bungie.net${rv}`
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

export const shared = new BungieNetClient()