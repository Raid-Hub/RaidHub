import PrivateProfileError from "@/models/errors/PrivateProfileError"
import { BungieClientProtocol } from "bungie-net-core"
import { BungieMembershipType, DestinyCharacterComponent } from "bungie-net-core/models"
import { getProfile } from "bungie-net-core/endpoints/Destiny2"

export async function getFirstCharacter({
    destinyMembershipId,
    membershipType,
    client
}: {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    client: BungieClientProtocol
}): Promise<DestinyCharacterComponent> {
    const res = await getProfile(client, {
        destinyMembershipId,
        membershipType,
        components: [200 /**DestinyComponentType.Characters*/]
    })
    const data = res.Response.characters.data
    if (!data) {
        throw new PrivateProfileError({
            destinyMembershipId,
            membershipType,
            components: [200 /**DestinyComponentType.Characters*/]
        })
    }
    const character = Object.values(data)[0]
    if (!character) {
        throw Error("No characters found")
    }
    return character
}
