import { getCharacter, getPostGameCarnageReport } from 'oodestiny/endpoints/Destiny2'
import {
    BungieMembershipType,
    DestinyComponentType,
    DestinyPostGameCarnageReportData,
    DestinyPostGameCarnageReportEntry,
} from 'oodestiny/schemas'
import Emblems from "./emblems.json" assert { type: "json" }

const emblems: { [hash: string]: string } = Emblems
const defaultEmblem = "/common/destiny2_content/icons/1740254cb1bb978b2c7f0f3d03f58c6b.jpg"
const CACHE_MINUTES = 10

type CacheRequest = {
    timestamp: number
    data: string
}

export class BungieNetClient {
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
        } catch (e) {
            // TODO: handle errors here
            throw e
        }
    }

    async getCharacterEmblem(characterId: string, destinyMembershipId: string, membershipType: BungieMembershipType): Promise<string> {
        const CACHE_KEY = `getCharacter_${characterId}_${destinyMembershipId}_${membershipType}`;
        const cached = this.hitCache(CACHE_KEY)
        if (cached) return cached;

        let rv: string = ""
        try {
            const res = await getCharacter({ characterId, destinyMembershipId, membershipType, components: [DestinyComponentType.Characters] })
            if (!res.Response.character.data) {
                rv = "https://bungie.net" + defaultEmblem
            } else {
                rv = "https://bungie.net" + this.emblemFromHash(res.Response.character.data.emblemHash)
            }
            this.setCache(CACHE_KEY, rv)
        } catch (e) {
            // TODO: handle errors here
            rv = "https://bungie.net" + defaultEmblem
        } finally {
            return rv
        }
    }

    private emblemFromHash(hash: number) {
        return emblems[hash] ?? defaultEmblem
    }

    /** Checks the local cache for value first */
    private hitCache(cashKey: string): string | null {
        const cachedData = localStorage.getItem(cashKey);
        if (cachedData) {
            try {
                const { timestamp, data } = JSON.parse(cachedData) as CacheRequest;
                if (Date.now() - timestamp < CACHE_MINUTES * 60 * 1000) {
                    return data
                } else {
                    return null
                }
            } catch (e) {
                return null
            }
        } else {
            return null
        }
    }

    /** Set a key of the cache to a value */
    private setCache(cashKey: string, value: string): void {
        const dataToCache: CacheRequest = { timestamp: Date.now(), data: value };
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