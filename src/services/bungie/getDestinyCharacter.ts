import { BungieClientProtocol } from "bungie-net-core/lib/api"
import { getCharacter } from "bungie-net-core/lib/endpoints/Destiny2"
import {
    BungieMembershipType,
    DestinyCharacterComponent,
    DestinyComponentType
} from "bungie-net-core/lib/models"
import PrivateProfileError from "../../models/errors/PrivateProfileError"

export async function getDestinyCharacter({
    destinyMembershipId,
    membershipType,
    characterId,
    client
}: {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    characterId: string
    client: BungieClientProtocol
}): Promise<DestinyCharacterComponent> {
    const { Response } = await getCharacter(
        {
            destinyMembershipId,
            membershipType,
            characterId,
            components: [DestinyComponentType.Characters]
        },
        client
    )

    const character = Response.character
    if (!character) {
        throw new Error("Deleted character")
    }
    const data = character.data
    if (!data) {
        throw new PrivateProfileError({
            destinyMembershipId,
            membershipType,
            components: [DestinyComponentType.Characters]
        })
    }
    return data
}
