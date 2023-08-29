import { BungieClientProtocol } from "bungie-net-core"
import { BungieMembershipType, DestinyLinkedProfilesResponse } from "bungie-net-core/models"
import { getLinkedProfiles } from "bungie-net-core/endpoints/Destiny2"

export async function getLinkedBungieProfiles({
    membershipId,
    membershipType,
    client
}: {
    membershipId: string
    membershipType: BungieMembershipType
    client: BungieClientProtocol
}): Promise<DestinyLinkedProfilesResponse> {
    const { Response } = await getLinkedProfiles(client, {
        membershipId,
        membershipType,
        getAllMemberships: true
    })
    return {
        ...Response,
        profiles: Response.profiles.filter(
            profile =>
                ![
                    254 /** BungieMembershipType.BungieNext */, 0 /** BungieMembershipType.None */
                ].includes(profile.membershipType)
        )
    }
}
