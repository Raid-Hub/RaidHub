import { BungieClientProtocol } from "bungie-net-core/lib/api"
import { getProfile } from "bungie-net-core/lib/endpoints/Destiny2"
import {
    BungieMembershipType,
    DestinyComponentType,
    DestinyProfileTransitoryComponent
} from "bungie-net-core/lib/models"
import PrivateProfileError from "../../models/errors/PrivateProfileError"

export async function getProfileTransitory({
    destinyMembershipId,
    membershipType,
    client
}: {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    client: BungieClientProtocol
}): Promise<DestinyProfileTransitoryComponent | null> {
    const res = await getProfile(
        {
            destinyMembershipId,
            membershipType,
            components: [DestinyComponentType.Transitory]
        },
        client
    )
    const { data, privacy } = res.Response.profileTransitoryData
    if (privacy > 1) {
        throw new PrivateProfileError({
            destinyMembershipId,
            membershipType,
            components: [DestinyComponentType.Transitory]
        })
    }
    return data ?? null
}
