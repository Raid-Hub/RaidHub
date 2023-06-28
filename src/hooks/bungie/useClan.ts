import { BungieMembershipType } from "bungie-net-core/lib/models"
import { useCallback, useEffect, useState } from "react"
import { Clan, ErrorHandler } from "../../util/types"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "./useBungieClient"

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
    console.log("d")

    const fetchData = useCallback(
        async (membershipId: string, membershipType: BungieMembershipType) => {
            return client.getClan(membershipId, membershipType)
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
