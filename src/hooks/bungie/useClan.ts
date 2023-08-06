import { BungieMembershipType } from "bungie-net-core/lib/models"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { getClan } from "../../services/bungie/getClan"
import { ErrorHandler } from "../../types/generic"
import { resolveClanBanner } from "../../util/destiny/clanBanner"
import { useClanBanners } from "../../components/app/DestinyManifestManager"
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
    const bannerDefs = useClanBanners()
    const client = useBungieClient()

    const { data, ...query } = useQuery({
        queryKey: ["clan", membershipId, membershipType],
        onError: e => CustomError.handle(errorHandler, e, ErrorCode.CharacterStats),
        queryFn: () => getClan({ membershipId, membershipType, client }),
        staleTime: 2 * 60000 // character stats change often
    })

    return {
        data: data
            ? {
                  ...data,
                  clanBanner: resolveClanBanner(data.clanInfo.clanBannerData, bannerDefs)
              }
            : data,
        ...query
    }
}
