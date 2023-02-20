import { getCharacter, getPostGameCarnageReport } from 'oodestiny/endpoints/Destiny2'
import {
    BungieMembershipType,
    DestinyInventoryItemDefinition,
    DestinyComponentType,
    DestinyPostGameCarnageReportData,
} from 'oodestiny/schemas'
import Emblems from "../util/emblems.json" assert { type: "JSON" }

const emblems: {[hash: string]: string} = Emblems
const defaultEmblem = "/common/destiny2_content/icons/1740254cb1bb978b2c7f0f3d03f58c6b.jpg"

export class DestinyClient {
    public readonly access_token: string | null;
    constructor(access_token?: string) {
        this.access_token = access_token ?? null;
    }

    async getPGCR(activityId: string): Promise<DestinyPostGameCarnageReportData> {
        const res = await getPostGameCarnageReport({ activityId })
        return res.Response;
    }

    async getCharacterEmblem(characterId: string, destinyMembershipId: string, membershipType: BungieMembershipType): Promise<string> {
        const res = await getCharacter({ characterId, destinyMembershipId, membershipType, components: [DestinyComponentType.Characters] })
        if (!res.Response.character.data) {
            return "https://bungie.net" + defaultEmblem
        } else {
            return "https://bungie.net" + this.emblemFromHash(res.Response.character.data.emblemHash)
        }
    }

    emblemFromHash(hash: number) {
        return emblems[hash] ?? defaultEmblem
    }
}