import { BungieClientProtocol } from "bungie-net-core"
import PrivateProfileError from "@/models/errors/PrivateProfileError"
import { BungieMembershipType, DestinyCharacterComponent } from "bungie-net-core/models"
import { getCharacter } from "bungie-net-core/endpoints/Destiny2"

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
    const { Response } = await getCharacter(client, {
        destinyMembershipId,
        membershipType,
        characterId,
        components: [200 /**DestinyComponentType.Characters*/]
    })

    const character = Response.character
    if (!character) {
        throw new Error("Deleted character")
    }
    const data = character.data
    if (!data) {
        throw new PrivateProfileError({
            destinyMembershipId,
            membershipType,
            components: [200 /**DestinyComponentType.Characters*/]
        })
    }
    return data
}
