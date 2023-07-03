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
    const profile = res.Response.profile.data
    const characters = res.Response.characters.data
    if (!profile || !characters) {
        throw new PrivateProfileError({
            destinyMembershipId,
            membershipType,
            components: [DestinyComponentType.Profiles, DestinyComponentType.Characters]
        })
    }
    return {
        ...profile,
        emblemBackgroundPath: characters[profile.characterIds[0]].emblemBackgroundPath
    }
}
