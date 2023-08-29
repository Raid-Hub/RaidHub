import { ProfileComponent } from "@/types/profile"
import PrivateProfileError from "@/models/errors/PrivateProfileError"
import { BungieClientProtocol } from "bungie-net-core"
import { getProfile } from "bungie-net-core/endpoints/Destiny2"
import { BungieMembershipType } from "bungie-net-core/models"

export async function getDestinyProfile({
    destinyMembershipId,
    membershipType,
    client
}: {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    client: BungieClientProtocol
}): Promise<ProfileComponent> {
    const res = await getProfile(client, {
        destinyMembershipId,
        membershipType,
        components: [100, 200 /**DestinyComponentType.Profiles, DestinyComponentType.Characters*/]
    })
    const { data: profileData, privacy: profilePrivacy } = res.Response.profile
    const { data: charactersData, privacy: charactersPrivacy } = res.Response.characters
    if (profilePrivacy > 1 || charactersPrivacy > 1) {
        throw new PrivateProfileError({
            destinyMembershipId,
            membershipType,
            components: [
                100, 200 /**DestinyComponentType.Profiles, DestinyComponentType.Characters*/
            ]
        })
    } else if (!profileData || !charactersData) {
        throw new Error("Missing data")
    }
    return {
        ...profileData,
        emblemBackgroundPath: charactersData[profileData.characterIds[0]].emblemBackgroundPath
    }
}
