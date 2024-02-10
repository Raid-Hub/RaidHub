import { useQuery } from "@tanstack/react-query"
import { getLinkedProfiles } from "bungie-net-core/endpoints/Destiny2"
import { useBungieClient } from "~/app/managers/session/BungieClientProvider"

export const useLinkedProfiles = (params: { membershipId: string }) => {
    const bungieClient = useBungieClient()

    return useQuery({
        queryKey: ["bungie", "linked profiles", params] as const,
        queryFn: ({ queryKey }) =>
            getLinkedProfiles(bungieClient, {
                getAllMemberships: true,
                membershipId: queryKey[2].membershipId,
                membershipType: -1 // all
            }).then(res => res.Response),
        staleTime: 1000 * 60 * 24 // 1 hour
    })
}
