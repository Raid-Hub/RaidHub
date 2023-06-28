import { useCallback, useEffect, useState } from "react"
import { BungieMembershipType, UserInfoCard } from "bungie-net-core/lib/models"
import { ErrorHandler } from "../../util/types"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "./useBungieClient"

type UseBungieProfileParams = {
    membershipId: string
    membershipType: BungieMembershipType
    errorHandler: ErrorHandler
}

type UseBungieProfile = {
    membership: UserInfoCard | undefined
    isLoading: boolean
}

export function useBungieNextMembership({
    membershipId,
    membershipType,
    errorHandler
}: UseBungieProfileParams): UseBungieProfile {
    const [membership, setMembership] = useState<UserInfoCard | undefined>(undefined)
    const [isLoading, setLoading] = useState<boolean>(true)
    const client = useBungieClient()
    console.log("b")

    const getBungieNextMembership = useCallback(
        async (membershipId: string, membershipType: BungieMembershipType) => {
            return client.getBungieNextMembership(membershipId, membershipType)
        },
        [client]
    )
    useEffect(() => {
        setLoading(true)
        getActivities()

        async function getActivities() {
            try {
                const membership = await getBungieNextMembership(membershipId, membershipType)
                setMembership(membership)
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.BungieNextMembership)
            } finally {
                setLoading(false)
            }
        }
    }, [membershipId, membershipType, errorHandler, getBungieNextMembership])
    return { membership, isLoading }
}
