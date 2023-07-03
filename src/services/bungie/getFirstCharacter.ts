import { BungieClientProtocol } from "bungie-net-core/lib/api"
import {
    BungieMembershipType,
    DestinyCharacterComponent,
    DestinyComponentType
} from "bungie-net-core/lib/models"
import { getProfile } from "bungie-net-core/lib/endpoints/Destiny2"
import PrivateProfileError from "../../models/errors/PrivateProfileError"

export async function getFirstCharacter({
    destinyMembershipId,
    membershipType,
    client
}: {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    client: BungieClientProtocol
}): Promise<DestinyCharacterComponent> {
    const res = await getProfile(
        {
            destinyMembershipId,
            membershipType,
            components: [DestinyComponentType.Characters]
        },
        client
    )
    const data = res.Response.characters.data
    if (!data) {
        throw new PrivateProfileError({
            destinyMembershipId,
            membershipType,
            components: [DestinyComponentType.Characters]
        })
    }
    const character = Object.values(data)[0]
    if (!character) {
        throw Error("No characters found")
    }
    return character
}
