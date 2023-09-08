import { BungieClientProtocol } from "bungie-net-core"
import { getProfile } from "bungie-net-core/endpoints/Destiny2"
import { BungieMembershipType } from "bungie-net-core/models"

export async function getLiveProfileData({
    destinyMembershipId,
    membershipType,
    client
}: {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    client: BungieClientProtocol
}) {
    const { Response } = await getProfile(client, {
        destinyMembershipId,
        membershipType,
        components: [
            100, 200 /*Characters*/, 205 /*DestinyComponentType.CharacterEquipment*/,
            204 /*DestinyComponentType.CharacterActivities*/
        ]
    })
    return Response
}
