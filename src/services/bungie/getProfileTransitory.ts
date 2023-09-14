import { getProfile as bungieGetProfile } from "bungie-net-core/endpoints/Destiny2"
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
        const { Response } = await bungieGetProfile(client, {
            destinyMembershipId,
            membershipType,
            components: [1000 /*DestinyComponentType.Transitory */]
        })

        if (!Response.profileTransitoryData.data) {
            console.error("OH NO")
            throw Error("OH NO")
        }
        return Response.profileTransitoryData.data
    }
