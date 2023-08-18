import { BungieMembershipType } from "bungie-net-core/lib/models"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { getClan } from "../../services/bungie/getClan"
import { ErrorHandler } from "../../types/generic"
import { useClanBanner } from "../../components/app/DestinyManifestManager"
import { useQuery } from "@tanstack/react-query"

export function useClan({
    membershipId,
    membershipType,
    errorHandler
}: {
    membershipId: string
    membershipType: BungieMembershipType
    errorHandler: ErrorHandler
}) {
    const client = useBungieClient()

    const { data, ...query } = useQuery({
        queryKey: ["clan", membershipId, membershipType],
        onError: e => CustomError.handle(errorHandler, e, ErrorCode.Clan),
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
