import { BungieClientProtocol } from "bungie-net-core/lib/api"
import { BungieMembershipType, DestinyProfileUserInfoCard } from "bungie-net-core/lib/models"
import { getLinkedProfiles } from "bungie-net-core/lib/endpoints/Destiny2"
import { isPrimaryCrossSave } from "../../util/destiny/crossSave"

export async function getLinkedDestinyProfile({
    membershipId,
    client
}: {
    membershipId: string
    client: BungieClientProtocol
}): Promise<DestinyProfileUserInfoCard> {
    const { Response } = await getLinkedProfiles(
        {
            membershipId,
            membershipType: BungieMembershipType.All
        },
        client
    )
    return Response.profiles.find(p => isPrimaryCrossSave(p))!
}
