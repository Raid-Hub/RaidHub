import { getProfile } from "bungie-net-core/endpoints/Destiny2"
import { type BungieMembershipType } from "bungie-net-core/models"
import ServerBungieClient from "~/server/serverBungieClient"
import { getRaidHubApi } from "~/services/raidhub"

const serverBungieClient = new ServerBungieClient({
    revalidate: 15 * 60
})

// Get a player's profile from the RaidHub API
export const getRaidHubPlayerProfile = (params: { membershipId: string }) =>
    getRaidHubApi(
        "/player/{membershipId}/profile",
        {
            membershipId: params.membershipId
        },
        null,
        {
            next: {
                revalidate: 60
            }
        }
    )

export const getDestinyProfile = (params: {
    destinyMembershipId: string
    membershipType: BungieMembershipType
}) =>
    getProfile(serverBungieClient, {
        ...params,
        components: [100, 200]
    }).then(res => res.Response)
