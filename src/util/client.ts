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
        try {
            const res = await getCharacter({ characterId, destinyMembershipId, membershipType, components: [DestinyComponentType.Characters] })
            if (!res.Response.character.data) {
                return "https://bungie.net" + defaultEmblem
            } else {
                return "https://bungie.net" + this.emblemFromHash(res.Response.character.data.emblemHash)
            }
        } catch (e) {
            // TODO: handle errors here
            return "https://bungie.net" + defaultEmblem
        }
    }

    private emblemFromHash(hash: number) {
        return emblems[hash] ?? defaultEmblem
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