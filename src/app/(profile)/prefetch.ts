import "server-only"

import { getProfile } from "bungie-net-core/endpoints/Destiny2"
import { type BungieMembershipType } from "bungie-net-core/models"
import { cache } from "react"
import { trpcServer } from "~/server/api/trpc/client"
import ServerBungieClient from "~/server/serverBungieClient"
import { getRaidHubApi } from "~/services/raidhub/common"

const serverBungieClient = new ServerBungieClient({
    revalidate: 15 * 60
})

// Caching version of the trpc query
export const getUniqueProfileByVanity = cache((vanity: string) =>
    trpcServer.profile.getUnique.query({ vanity }).catch(() => null)
)
export const getUniqueProfileByDestinyMembershipId = cache((destinyMembershipId: string) =>
    trpcServer.profile.getUnique.query({ destinyMembershipId }).catch(() => null)
)

// Get a player's profile from the RaidHub API
export const prefetchRaidHubPlayerProfile = cache((params: { membershipId: string }) =>
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
    ).catch(() => null)
)

// Get a player's basic info from the RaidHub API (fast)
export const prefetchRaidHubPlayerBasic = cache((params: { membershipId: string }) =>
    getRaidHubApi(
        "/player/{membershipId}/basic",
        {
            membershipId: params.membershipId
        },
        null,
        {
            next: {
                revalidate: 24 * 3600
            }
        }
    ).catch(() => null)
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
