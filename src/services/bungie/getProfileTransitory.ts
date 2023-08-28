import { BungieClientProtocol } from "bungie-net-core"
import PrivateProfileError from "../../models/errors/PrivateProfileError"
import { getProfile } from "bungie-net-core/endpoints/Destiny2"
import { BungieMembershipType } from "bungie-net-core/models"

export async function getProfileTransitory({
    destinyMembershipId,
    membershipType,
    client
}: {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    client: BungieClientProtocol
}) {
    const res = await getProfile(client, {
        destinyMembershipId,
        membershipType,
        components: [
            1000, 204 /**DestinyComponentType.Transitory, DestinyComponentType.CharacterActivities*/
        ]
    })
    const { data: transitoryData, privacy: transitoryPrivacy } = res.Response.profileTransitoryData
    const { data: characterData } = res.Response.characterActivities
    if (!characterData) {
        throw new PrivateProfileError({
            destinyMembershipId,
            membershipType,
            components: [
                1000,
                204 /**DestinyComponentType.Transitory, DestinyComponentType.CharacterActivities*/
            ]
        })
    }
    if (!transitoryData) {
        return null
    }
    return {
        data: transitoryData,
        current: Object.values(characterData).sort(
            (a, b) =>
                new Date(b.dateActivityStarted).getTime() -
                new Date(a.dateActivityStarted).getTime()
        )[0]
    }
}
