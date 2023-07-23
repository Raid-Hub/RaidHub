import { BungieMembershipType } from "bungie-net-core/lib/models"
import { useCallback, useEffect, useState } from "react"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { getClan } from "../../services/bungie/getClan"
import { ErrorHandler } from "../../types/generic"
import { resolveClanBanner } from "../../util/destiny/clanBanner"
import { useClanBanners } from "../../components/app/DestinyManifestManager"
import { Clan } from "../../types/profile"

type UseClanParams = {
    membershipId: string
    membershipType: BungieMembershipType
    errorHandler: ErrorHandler
}

type UseClan = {
    clan: Clan | null
    isLoading: boolean
}

export function useClan({ membershipId, membershipType, errorHandler }: UseClanParams): UseClan {
    const [clan, setClan] = useState<Clan | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    const client = useBungieClient()
    const bannerDefs = useClanBanners()

    const fetchData = useCallback(
        async (membershipId: string, membershipType: BungieMembershipType) => {
            try {
                setClan(null)
                const group = await getClan({ membershipId, membershipType, client })
                setClan(
                    group
                        ? {
                              ...group,
                              clanBanner: resolveClanBanner(
                                  group.clanInfo.clanBannerData,
                                  bannerDefs
                              )
                          }
                        : null
                )
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.Clan)
            } finally {
                setLoading(false)
            }
        },
        [client, errorHandler, bannerDefs]
    )

    useEffect(() => {
        setLoading(true)
        fetchData(membershipId, membershipType)
    }, [membershipId, membershipType, fetchData])
    return { clan, isLoading }
}
