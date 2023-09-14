import { getProfile } from "bungie-net-core/endpoints/Destiny2"
import { BungieMembershipType } from "bungie-net-core/models"
import BungieClient from "../../util/bungieClient"

export const getProfileTransitory =
    (client: BungieClient) =>
    async ({
        destinyMembershipId,
        membershipType
    }: {
        destinyMembershipId: string
        membershipType: BungieMembershipType
    }) => {
        const { Response } = await getProfile(client, {
            destinyMembershipId,
            membershipType,
            components: [1000 /*DestinyComponentType.Transitory */]
        })

        if (!Response.profileTransitoryData.data) {
            return {
                currentActivity: null
            }
        } else {
            return Response.profileTransitoryData.data
        }
    }
