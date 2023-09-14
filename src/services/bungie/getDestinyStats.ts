import { BungieMembershipType } from "bungie-net-core/models"
import { getHistoricalStatsForAccount } from "bungie-net-core/endpoints/Destiny2"
import BungieClient from "~/util/bungieClient"

export const getDestinyStats =
    (client: BungieClient) =>
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

        // const characterMemberships = profileStats.map(
        //     ([destinyMembershipId, membershipType, stats]) => ({
        //         destinyMembershipId,
        //         membershipType,
        //         characterIds: stats.characters.map(c => c.characterId)
        //     })
        // )
        // const historicalStats = profileStats.flatMap(([id, type, stats]) => stats.characters)

        // return { characterMemberships, historicalStats }
    }
