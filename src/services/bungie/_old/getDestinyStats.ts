import { BungieMembershipType } from "bungie-net-core/models"
import { getHistoricalStatsForAccount } from "bungie-net-core/endpoints/Destiny2"
import { BungieClientProtocol } from "bungie-net-core"

export const getDestinyStats = {
    key: "stats",
    fn:
        (client: BungieClientProtocol) =>
        async ({
            destinyMembershipId,
            membershipType
        }: {
            destinyMembershipId: string
            membershipType: BungieMembershipType
        }) => {
            const { Response } = await getHistoricalStatsForAccount(client, {
                destinyMembershipId,
                membershipType
            })

            return { destinyMembershipId, membershipType, ...Response }
        }
}
