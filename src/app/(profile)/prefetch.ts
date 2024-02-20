import "server-only"

import { getProfile } from "bungie-net-core/endpoints/Destiny2"
import { type BungieMembershipType } from "bungie-net-core/models"
import { cache } from "react"
import { trpcServer } from "~/server/api/trpc/client"
import ServerBungieClient from "~/server/serverBungieClient"
import { getRaidHubApi } from "~/services/raidhub"

const serverBungieClient = new ServerBungieClient({
    revalidate: 15 * 60
})

// Caching version of the trpc query
export const getUniqueProfile = cache(
    (
        input:
            | {
                  destinyMembershipId: string
              }
            | {
                  vanity: string
              }
    ) => trpcServer.profile.getUnique.query(input)
)

// Get a player's profile from the RaidHub API
export const getRaidHubPlayerProfile = cache((params: { membershipId: string }) =>
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
)

// the results are cached implicitly by the serverBungieClient
export const getDestinyProfile = (params: {
    destinyMembershipId: string
    membershipType: BungieMembershipType
}) =>
    getProfile(serverBungieClient, {
        ...params,
        components: [100, 200]
    }).then(res => res.Response)
