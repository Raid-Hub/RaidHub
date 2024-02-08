import { useQuery } from "@tanstack/react-query"
import { getProfile } from "bungie-net-core/endpoints/Destiny2"
import { BungieMembershipType } from "bungie-net-core/models"
import { useBungieClient } from "~/app/managers/BungieTokenManager"

export const useProfile = (
    params: {
        destinyMembershipId: string
        membershipType: BungieMembershipType
    },
    opts: {
        refetchOnWindowFocus?: boolean
        refetchOnMount?: boolean
        refetchInterval?: number
    }
) => {
    const bungieClient = useBungieClient()

    return useQuery({
        queryKey: ["bungie", "profile", "primary", params] as const,
        queryFn: ({ queryKey }) =>
            getProfile(bungieClient, {
                ...queryKey[3],
                components: [
                    100 /*Profiles*/, 200 /*Characters*/, 202 /*CharacterProgressions*/,
                    205 /*CharacterEquipment*/, 204 /*CharacterActivities*/, 305 /*ItemSockets */
                ]
            }).then(res => res.Response),
        ...opts
    })
}
