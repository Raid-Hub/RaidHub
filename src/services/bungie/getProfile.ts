import { getProfile as bungieGetProfile } from "bungie-net-core/endpoints/Destiny2"
import { BungieMembershipType } from "bungie-net-core/models"
import { BungieClientProtocol } from "bungie-net-core"

export const getProfile = {
    key: "profile",
    fn:
        (client: BungieClientProtocol) =>
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
                    100, 200 /*Characters*/, 202 /*CharacterProgressions*/,
                    205 /*DestinyComponentType.CharacterEquipment*/,
                    204 /*DestinyComponentType.CharacterActivities*/,
                    305 /*DestinyComponentType.ItemSockets */
                ]
            })
            return Response
        }
}

export const getBasicProfile = {
    key: "profile",
    fn:
        (client: BungieClientProtocol) =>
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
                components: [100, 200]
            })
            return Response
        }
}

export const getProfileTransitory = {
    key: "profile-transitory",
    fn:
        (client: BungieClientProtocol) =>
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
                return {
                    currentActivity: null
                }
            } else {
                return Response.profileTransitoryData.data
            }
        }
}
