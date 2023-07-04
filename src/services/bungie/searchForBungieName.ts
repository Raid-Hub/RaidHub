import { BungieMembershipType, UserInfoCard } from "bungie-net-core/lib/models"
import { searchDestinyPlayerByBungieName } from "bungie-net-core/lib/endpoints/Destiny2"
import { BungieClientProtocol } from "bungie-net-core/lib/api"
import { isPrimaryCrossSave } from "../../util/destiny/crossSave"

export async function searchForBungieName({
    displayName,
    displayNameCode,
    client
}: {
    displayName: string
    displayNameCode: number
    client: BungieClientProtocol
}): Promise<UserInfoCard> {
    const response = await searchDestinyPlayerByBungieName(
        {
            membershipType: BungieMembershipType.All
        },
        {
            displayName,
            displayNameCode
        },
        client
    )
    console.log(response.Response)
    return response.Response.filter(isPrimaryCrossSave)[0]
}
