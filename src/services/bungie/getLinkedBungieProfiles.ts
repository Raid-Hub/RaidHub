import { BungieClientProtocol } from "bungie-net-core/lib/api"
import { BungieMembershipType, DestinyLinkedProfilesResponse } from "bungie-net-core/lib/models"
import { getLinkedProfiles } from "bungie-net-core/lib/endpoints/Destiny2"

export async function getLinkedBungieProfiles({
    membershipId,
    membershipType,
    client
}: {
    membershipId: string
    membershipType: BungieMembershipType
    client: BungieClientProtocol
}): Promise<DestinyLinkedProfilesResponse> {
    const { Response } = await getLinkedProfiles(
        {
            membershipId,
            membershipType,
            getAllMemberships: true
        },
        client
    )
    return {
        ...Response,
        profiles: Response.profiles.filter(
            profile =>
                ![BungieMembershipType.BungieNext, BungieMembershipType.None].includes(
                    profile.membershipType
                )
        )
    }
}
