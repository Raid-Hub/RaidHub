import { BungieClientProtocol } from "bungie-net-core/api"
import { BungieMembershipType, UserInfoCard } from "bungie-net-core/models"
import { getLinkedProfiles } from "bungie-net-core/endpoints/Destiny2"

export async function getBungieNextProfile({
    membershipId,
    membershipType,
    client
}: {
    membershipId: string
    membershipType: BungieMembershipType
    client: BungieClientProtocol
}): Promise<UserInfoCard> {
    const res = await getLinkedProfiles(
        {
            membershipId,
            membershipType
        },
        client
    )
    return res.Response.bnetMembership
}
