import { useCallback, useEffect, useState } from "react"
import { BungieMembershipType, UserInfoCard } from "bungie-net-core/models"
import { ErrorHandler } from "../../types/generic"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "./useBungieClient"
import { getBungieNextProfile } from "../../services/bungie/getBungieNextProfile"

type UseBungieProfileParams = {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    errorHandler: ErrorHandler
}

type UseBungieProfile = {
    membership: UserInfoCard | undefined
    isLoading: boolean
}

export function useBungieNextMembership({
    destinyMembershipId,
    membershipType,
    errorHandler
}: UseBungieProfileParams): UseBungieProfile {
    const [membership, setMembership] = useState<UserInfoCard | undefined>(undefined)
    const [isLoading, setLoading] = useState<boolean>(true)
    const client = useBungieClient()

    const getBungieNextMembership = useCallback(
        async (membershipId: string, membershipType: BungieMembershipType) =>
            getBungieNextProfile({ membershipId, membershipType, client }),
        [client]
    )
    useEffect(() => {
        setLoading(true)
        getActivities()

        async function getActivities() {
            try {
                const membership = await getBungieNextMembership(
                    destinyMembershipId,
                    membershipType
                )
                setMembership(membership)
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.BungieNextMembership)
            } finally {
                setLoading(false)
            }
        }
    }, [destinyMembershipId, membershipType, errorHandler, getBungieNextMembership])
    return { membership, isLoading }
}
