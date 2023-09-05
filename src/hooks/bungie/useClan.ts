import { useBungieClient } from "@/components/app/TokenManager"
import { getClan } from "@/services/bungie/getClan"
import { useClanBanner } from "@/components/app/DestinyManifestManager"
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

    const { data, ...query } = useQuery({
        queryKey: ["clan", membershipId, membershipType],
        queryFn: () => getClan({ membershipId, membershipType, client }),
        staleTime: 10 * 60000 // clan does not update very often
    })

    const { data: clanBanner } = useClanBanner(data?.clanInfo.clanBannerData ?? null)

    return {
        data: data
            ? {
                  ...data,
                  clanBanner
              }
            : data,
        ...query
    }
}
