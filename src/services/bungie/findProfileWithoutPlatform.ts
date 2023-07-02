import { BungieClientProtocol } from "bungie-net-core/api"
import {
    BungieMembershipType,
    DestinyComponentType,
    DestinyProfileResponse
} from "bungie-net-core/models"
import { getProfile } from "bungie-net-core/endpoints/Destiny2"
import { isPrimaryCrossSave } from "../../util/destiny/isPrimaryCrossSave"

type FulfilledPromise = PromiseFulfilledResult<
    DestinyProfileResponse<[DestinyComponentType.Profiles, DestinyComponentType.Characters]>
>

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
        BungieMembershipType.TigerPsn,
        BungieMembershipType.TigerXbox,
        BungieMembershipType.TigerSteam,
        BungieMembershipType.TigerEgs,
        BungieMembershipType.TigerStadia,
        BungieMembershipType.TigerDemon,
        BungieMembershipType.TigerBlizzard
    ]

    const possibleProfilePromises = await Promise.allSettled(
        possibleTypes.map(membershipType =>
            getProfile(
                {
                    destinyMembershipId,
                    membershipType,
                    components: [DestinyComponentType.Profiles, DestinyComponentType.Characters]
                },
                client
            ).then(res => res.Response)
        )
    )

    const profile = (
        possibleProfilePromises.filter(
            promise => (promise.status = "fulfilled")
        ) as FulfilledPromise[]
    )
        .map(fulfilled => fulfilled.value)
        .filter(({ profile }) => profile.data && isPrimaryCrossSave(profile.data.userInfo))[0]

    return profile
}
