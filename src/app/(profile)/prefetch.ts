import "server-only"

import { getProfile } from "bungie-net-core/endpoints/Destiny2"
import { type BungieMembershipType } from "bungie-net-core/models"
import { trpcServer } from "~/server/api/trpc/client"
import ServerBungieClient from "~/server/serverBungieClient"
import { getRaidHubApi } from "~/services/raidhub/common"
import { reactDedupe } from "~/util/react-cache"

const serverBungieClient = new ServerBungieClient({
    revalidate: 15 * 60
})

// Caching version of the trpc query
export const getUniqueProfileByVanity = reactDedupe((vanity: string) =>
    trpcServer.profile.getUnique.query({ vanity }).catch(() => null)
)
export const getUniqueProfileByDestinyMembershipId = reactDedupe((destinyMembershipId: string) =>
    trpcServer.profile.getUnique.query({ destinyMembershipId }).catch(() => null)
)

// Get a player's profile from the RaidHub API
export const prefetchRaidHubPlayerProfile = reactDedupe((membershipId: string) =>
    getRaidHubApi(
        "/player/{membershipId}/profile",
        {
            membershipId: membershipId
        },
        null,
        {
            next: {
                revalidate: 60
            }
        }
    )
        .then(res => res.response)
        .catch(() => null)
)

// Get a player's basic info from the RaidHub API (fast)
export const prefetchRaidHubPlayerBasic = reactDedupe((membershipId: string) =>
    getRaidHubApi(
        "/player/{membershipId}/basic",
        {
            membershipId: membershipId
        },
        null,
        {
            next: {
                revalidate: 24 * 3600
            }
        }
    )
        .then(res => res.response)
        .catch(() => null)
)

// the results are cached implicitly by the serverBungieClient
export const prefetchDestinyProfile = (params: {
    destinyMembershipId: string
    membershipType: BungieMembershipType
}) =>
    getProfile(serverBungieClient, {
        ...params,
        components: [100, 200]
    })
        .then(res => res.Response)
        .catch(() => null)
