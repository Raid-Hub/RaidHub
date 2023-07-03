import { BungieMembershipType } from "bungie-net-core/lib/models"
import { useCallback, useEffect, useState } from "react"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { Clan, getClan } from "../../services/bungie/getClan"
import { ErrorHandler } from "../../types/generic"

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

    const fetchData = useCallback(
        async (membershipId: string, membershipType: BungieMembershipType) => {
            try {
                setClan(null)
                const clan = await getClan({ membershipId, membershipType, client })
                setClan(clan)
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.Clan)
            } finally {
                setLoading(false)
            }
        },
        [client, errorHandler]
    )

    useEffect(() => {
        setLoading(true)
        fetchData(membershipId, membershipType)
    }, [membershipId, membershipType, fetchData])
    return { clan, isLoading }
}
