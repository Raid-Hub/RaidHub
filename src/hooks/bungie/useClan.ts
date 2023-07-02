import { BungieMembershipType } from "bungie-net-core/models"
import { useCallback, useEffect, useState } from "react"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "./useBungieClient"
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
            return getClan({ membershipId, membershipType, client })
        },
        [client]
    )

    useEffect(() => {
        setLoading(true)
        getClan()

        async function getClan() {
            try {
                const clan = await fetchData(membershipId, membershipType)
                setClan(clan)
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.Clan)
            } finally {
                setLoading(false)
            }
        }
    }, [membershipId, membershipType, errorHandler, fetchData])
    return { clan, isLoading }
}
