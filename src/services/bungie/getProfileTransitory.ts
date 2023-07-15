import { BungieClientProtocol } from "bungie-net-core/lib/api"
import { getProfile } from "bungie-net-core/lib/endpoints/Destiny2"
import { BungieMembershipType, DestinyComponentType } from "bungie-net-core/lib/models"
import PrivateProfileError from "../../models/errors/PrivateProfileError"

export async function getProfileTransitory({
    destinyMembershipId,
    membershipType,
    client
}: {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    client: BungieClientProtocol
}) {
    const res = await getProfile(
        {
            destinyMembershipId,
            membershipType,
            components: [DestinyComponentType.Transitory, DestinyComponentType.CharacterActivities]
        },
        client
    )
    const { data: transitoryData, privacy: transitoryPrivacy } = res.Response.profileTransitoryData
    const { data: characterData, privacy: characterPrivacy } = res.Response.characterActivities
    if (transitoryPrivacy > 1) {
        throw new PrivateProfileError({
            destinyMembershipId,
            membershipType,
            components: [DestinyComponentType.Transitory, DestinyComponentType.CharacterActivities]
        })
    }
    if (!transitoryData || !characterData) {
        return null
    }
    return {
        data: transitoryData,
        current: Object.values(characterData).find(c => c.currentActivityHash)!
    }
}
