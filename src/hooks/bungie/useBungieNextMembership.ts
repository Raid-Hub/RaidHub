import { useCallback, useEffect, useState } from "react"
import { BungieMembershipType, UserInfoCard } from "bungie-net-core/models"
import { ErrorHandler } from "../../types/generic"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { getBungieNextProfile } from "../../services/bungie/getBungieNextProfile"

type UseBungieProfileParams = {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    errorHandler: ErrorHandler
}

type UseBungieProfile = {
    membership: UserInfoCard | null
    isLoading: boolean
}

export function useBungieNextMembership({
    destinyMembershipId,
    membershipType,
    errorHandler
}: UseBungieProfileParams): UseBungieProfile {
    const [membership, setMembership] = useState<UserInfoCard | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    const client = useBungieClient()

    const fetchData = useCallback(
        async (membershipId: string, membershipType: BungieMembershipType) => {
            try {
                setMembership(null)
                const membership = await getBungieNextProfile({
                    membershipId,
                    membershipType,
                    client
                })
                setMembership(membership)
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.BungieNextMembership)
            } finally {
                setLoading(false)
            }
        },
        [client, errorHandler]
    )
    useEffect(() => {
        setLoading(true)
        fetchData(destinyMembershipId, membershipType)
    }, [destinyMembershipId, membershipType, fetchData])
    return { membership, isLoading }
}
