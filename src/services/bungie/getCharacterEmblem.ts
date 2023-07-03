import { BungieClientProtocol } from "bungie-net-core/lib/api"
import { BungieMembershipType, DestinyComponentType } from "bungie-net-core/lib/models"
import { getCharacter } from "bungie-net-core/lib/endpoints/Destiny2"
import { emblemFromHash } from "../../util/destiny/emblems"
import PrivateProfileError from "../../models/errors/PrivateProfileError"

export async function getCharacterEmblem({
    characterId,
    destinyMembershipId,
    membershipType,
    client
}: {
    characterId: string
    destinyMembershipId: string
    membershipType: BungieMembershipType
    client: BungieClientProtocol
}): Promise<string> {
    const res = await getCharacter(
        {
            characterId,
            destinyMembershipId,
            membershipType,
            components: [DestinyComponentType.Characters]
        },
        client
    )
    const data = res.Response.character.data
    if (data) {
        return emblemFromHash(data.emblemHash)
    } else {
        throw new PrivateProfileError({
            destinyMembershipId,
            membershipType,
            components: [DestinyComponentType.Characters]
        })
    }
}
