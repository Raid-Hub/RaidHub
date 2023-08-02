import { BungieMembershipType, GroupV2 } from "bungie-net-core/lib/models"
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
    const [group, setGroup] = useState<GroupV2 | null>(null)
    const [error, setError] = useState<any>()
    const [isLoading, setLoading] = useState<boolean>(true)
    const client = useBungieClient()
    const bannerDefs = useClanBanners()

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            setGroup(null)
            const group = await getClan({ membershipId, membershipType, client })
            setGroup(group)
        } catch (e) {
            setError(e)
        } finally {
            setLoading(false)
        }
    }, [client, membershipId, membershipType])

    useEffect(() => {
        error && CustomError.handle(errorHandler, error, ErrorCode.Clan)
    }, [errorHandler, error])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return {
        clan: group
            ? {
                  ...group,
                  clanBanner: resolveClanBanner(group.clanInfo.clanBannerData, bannerDefs)
              }
            : null,
        isLoading
    }
}
