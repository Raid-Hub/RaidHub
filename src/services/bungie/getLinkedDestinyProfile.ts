import { BungieClientProtocol } from "bungie-net-core"
import { isPrimaryCrossSave } from "../../util/destiny/crossSave"
import { DestinyProfileUserInfoCard } from "bungie-net-core/models"
import { getLinkedProfiles } from "bungie-net-core/endpoints/Destiny2"

export async function getLinkedDestinyProfile({
    membershipId,
    client
}: {
    membershipId: string
    client: BungieClientProtocol
}): Promise<DestinyProfileUserInfoCard> {
    const { Response } = await getLinkedProfiles(client, {
        membershipId,
        membershipType: -1 // all
    })
    return Response.profiles.find(p => isPrimaryCrossSave(p))!
}
