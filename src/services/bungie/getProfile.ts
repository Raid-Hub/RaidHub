import { getProfile as bungieGetProfile } from "bungie-net-core/endpoints/Destiny2"
import { BungieMembershipType } from "bungie-net-core/models"
import BungieClient from "../../util/bungieClient"

export const getProfile =
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
            components: [
                100, 200 /*Characters*/, 205 /*DestinyComponentType.CharacterEquipment*/,
                204 /*DestinyComponentType.CharacterActivities*/,
                305 /*DestinyComponentType.ItemSockets */, 1000 /*DestinyComponentType.Transitory */
            ]
        })
        return Response
    }
