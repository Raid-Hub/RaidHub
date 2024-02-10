import { useQuery } from "@tanstack/react-query"
import { getProfile } from "bungie-net-core/endpoints/Destiny2"
import { BungieMembershipType } from "bungie-net-core/models"
import { DestinyProfileResponse } from "bungie-net-core/models/Destiny/Responses/DestinyProfileResponse"
import { useBungieClient } from "~/app/managers/session/BungieTokenManager"

export const useProfileTransitory = (
    params: {
        destinyMembershipId: string
        membershipType: BungieMembershipType
    },
    opts: {
        refetchOnWindowFocus?: boolean
        refetchOnMount?: boolean
        refetchInterval?: number
        onSuccess?: (data: DestinyProfileResponse<[1000]>) => void
    }
) => {
    const bungieClient = useBungieClient()

    return useQuery({
        queryKey: ["bungie", "profile", "transitory", params] as const,
        queryFn: ({ queryKey }) =>
            getProfile(bungieClient, {
                ...queryKey[3],
                components: [1000 /*DestinyComponentType.Transitory */]
            }).then(res => res.Response),
        ...opts
    })
}
