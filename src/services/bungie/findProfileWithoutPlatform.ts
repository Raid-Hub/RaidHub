import { BungieClientProtocol } from "bungie-net-core/lib/api"
import {
    BungieMembershipType,
    DestinyComponentType,
    DestinyProfileResponse
} from "bungie-net-core/lib/models"
import { getProfile } from "bungie-net-core/lib/endpoints/Destiny2"
import { findPrimaryCrossSave } from "../../util/destiny/crossSave"

export async function findProfileWithoutPlatform({
    destinyMembershipId,
    client
}: {
    destinyMembershipId: string
    client: BungieClientProtocol
}): Promise<
    DestinyProfileResponse<[DestinyComponentType.Profiles, DestinyComponentType.Characters]>
> {
    const possibleTypes = [
        BungieMembershipType.TigerXbox,
        BungieMembershipType.TigerPsn,
        BungieMembershipType.TigerSteam,
        BungieMembershipType.TigerEgs,
        BungieMembershipType.TigerStadia,
        BungieMembershipType.TigerDemon,
        BungieMembershipType.TigerBlizzard
    ]

    const getProfileByMembershipType = (membershipType: BungieMembershipType) =>
        getProfile(
            {
                destinyMembershipId,
                membershipType,
                components: [DestinyComponentType.Profiles, DestinyComponentType.Characters]
            },
            client
        )

    for (const membershipType of possibleTypes) {
        try {
            const { Response } = await getProfileByMembershipType(membershipType)
            if (Response.profile.data) {
                const primaryMembershipType = findPrimaryCrossSave(Response.profile.data.userInfo)
                if (membershipType === primaryMembershipType) {
                    return Response
                } else {
                    return getProfileByMembershipType(primaryMembershipType).then(
                        res => res.Response
                    )
                }
            }
        } catch {
            continue
        }
    }
    throw Error("Could not find the proper membership type")
}
