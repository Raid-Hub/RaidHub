import { isPrimaryCrossSave } from "~/util/destiny/crossSave"
import { BungieClientProtocol } from "bungie-net-core"
import { UserInfoCard } from "bungie-net-core/models"
import { searchDestinyPlayerByBungieName } from "bungie-net-core/endpoints/Destiny2"

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
        client,
        {
            membershipType: -1
        },
        {
            displayName,
            displayNameCode
        }
    )
    return response.Response.filter(p => isPrimaryCrossSave(p))[0]
}
