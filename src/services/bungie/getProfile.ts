import { BungieClientProtocol } from "bungie-net-core/lib/api"
import { getProfile } from "bungie-net-core/lib/endpoints/Destiny2"
import { BungieMembershipType, DestinyComponentType } from "bungie-net-core/lib/models"
import { ProfileComponent } from "../../types/profile"
import PrivateProfileError from "../../models/errors/PrivateProfileError"

export async function getDestinyProfile({
    destinyMembershipId,
    membershipType,
    client
}: {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    client: BungieClientProtocol
}): Promise<ProfileComponent> {
    const res = await getProfile(
        {
            destinyMembershipId,
            membershipType,
            components: [DestinyComponentType.Profiles, DestinyComponentType.Characters]
        },
        client
    )
    const { data: profileData, privacy: profilePrivacy } = res.Response.profile
    const { data: charactersData, privacy: charactersPrivacy } = res.Response.characters
    if (profilePrivacy > 1 || charactersPrivacy > 1) {
        throw new PrivateProfileError({
            destinyMembershipId,
            membershipType,
            components: [DestinyComponentType.Profiles, DestinyComponentType.Characters]
        })
    } else if (!profileData || !charactersData) {
        throw new Error("Missing data")
    }
    return {
        ...profileData,
        emblemBackgroundPath: charactersData[profileData.characterIds[0]].emblemBackgroundPath
    }
}
