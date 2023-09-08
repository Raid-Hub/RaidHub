import { useBungieClient } from "~/components/app/TokenManager"
import { getClan } from "~/services/bungie/getClan"
import { useQuery } from "@tanstack/react-query"
import { BungieMembershipType } from "bungie-net-core/models"

export function useClan({
    membershipId,
    membershipType
}: {
    membershipId: string
    membershipType: BungieMembershipType
}) {
    const client = useBungieClient()

    return useQuery({
        queryKey: ["clan", membershipId, membershipType],
        queryFn: () => getClan({ membershipId, membershipType, client }),
        staleTime: 10 * 60000 // clan does not update very often
    })
}
