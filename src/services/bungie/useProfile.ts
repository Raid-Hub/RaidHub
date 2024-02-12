import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import { getProfile } from "bungie-net-core/endpoints/Destiny2"
import { type BungieMembershipType } from "bungie-net-core/models"
import { type DestinyProfileResponse } from "bungie-net-core/models/Destiny/Responses/DestinyProfileResponse"
import { useBungieClient } from "~/app/(layout)/managers/session/BungieClientProvider"
import { type AtLeast } from "~/types/generic"

export type UseProfileQueryData =
    | DestinyProfileResponse<[100, 200]>
    | DestinyProfileResponse<[100, 200, 202, 204, 205, 305]>

export const getUseProfileQueryKey = (
    destinyMembershipId: string,
    membershipType: BungieMembershipType
) => ["bungie", "profile", "primary", destinyMembershipId, membershipType] as const

export const useProfile = <T = UseProfileQueryData>(
    params: {
        destinyMembershipId: string
        membershipType: BungieMembershipType
    },
    opts?: AtLeast<
        UseQueryOptions<UseProfileQueryData, Error, T, ReturnType<typeof getUseProfileQueryKey>>,
        "enabled"
    >
) => {
    const bungieClient = useBungieClient()

    return useQuery<UseProfileQueryData, Error, T, ReturnType<typeof getUseProfileQueryKey>>({
        queryKey: getUseProfileQueryKey(params.destinyMembershipId, params.membershipType),
        queryFn: ({ queryKey }) =>
            getProfile(bungieClient, {
                destinyMembershipId: queryKey[3],
                membershipType: queryKey[4],
                components: [
                    100 /*Profiles*/, 200 /*Characters*/, 202 /*CharacterProgressions*/,
                    204 /*CharacterEquipment*/, 205 /*CharacterActivities*/, 305 /*ItemSockets */
                ]
            }).then(res => res.Response),
        ...opts
    })
}
