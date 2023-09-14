import { BungieMembershipType } from "bungie-net-core/models"
import { getDestinyAggregateActivityStats } from "bungie-net-core/endpoints/Destiny2"
import BungieClient from "~/util/bungieClient"

export const getDestinyStatsForCharacter =
    (client: BungieClient) =>
    async ({
        destinyMembershipId,
        membershipType,
        characterId
    }: {
        destinyMembershipId: string
        membershipType: BungieMembershipType
        characterId: string
    }) => {
        const { Response } = await getDestinyAggregateActivityStats(client, {
            characterId,
            destinyMembershipId,
            membershipType
        })

        return Response

        // return RaidStatsCollection.groupActivities(
        //     characterStats.flat().flatMap(stats => stats.activities)
        // )
    }
