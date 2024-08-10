import "server-only"
import { getServerSession } from "~/server/api/auth"

import { trpcServer } from "~/server/api/trpc/rpc"
import { getRaidHubApi } from "~/services/raidhub/common"
import { reactDedupe } from "~/util/react-cache"

export const getUniqueProfileByVanity = reactDedupe(async (vanity: string) =>
    trpcServer.profile.getUnique.query({ vanity }).catch(() => null)
)

export const getUniqueProfileByDestinyMembershipId = reactDedupe(
    async (destinyMembershipId: string) =>
        trpcServer.profile.getUnique.query({ destinyMembershipId }).catch(() => null)
)

// Get a player's profile from the RaidHub API
export const prefetchRaidHubPlayerProfile = reactDedupe(async (membershipId: string) => {
    const session = await getServerSession()
    return await getRaidHubApi(
        "/player/{membershipId}/profile",
        {
            membershipId: membershipId
        },
        null,
        {
            next: {
                revalidate: 60
            },
            headers: session?.raidHubAccessToken?.value
                ? {
                      Authorization: `Bearer ${session.raidHubAccessToken.value}`
                  }
                : {}
        }
    )
        .then(res => res.response)
        .catch(() => null)
})

// Get a player's basic info from the RaidHub API (fast)
export const prefetchRaidHubPlayerBasic = reactDedupe(async (membershipId: string) =>
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
