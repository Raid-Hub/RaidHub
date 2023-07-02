import { BungieMembershipType, UserInfoCard } from "bungie-net-core/models"
import { searchDestinyPlayerByBungieName } from "bungie-net-core/endpoints/Destiny2"
import { BungieClientProtocol } from "bungie-net-core/api"
import { isPrimaryCrossSave } from "../../util/destiny/isPrimaryCrossSave"

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
    return response.Response.filter(isPrimaryCrossSave)[0]
}
