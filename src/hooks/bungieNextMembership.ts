import { useEffect, useState } from "react"
import { shared as client } from "../util/http/bungie"
import { BungieMembershipType, UserInfoCard } from "bungie-net-core/lib/models"
import { ErrorHandler } from "../util/types"
import CustomError, { ErrorCode } from "../models/errors/CustomError"

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
    useEffect(() => {
        setLoading(true)
        getProfile()

        async function getProfile() {
            try {
                await client
                    .getBungieNextMembership(membershipId, membershipType)
                    .then(membership => setMembership(membership))
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.BungieNextMembership)
            } finally {
                setLoading(false)
            }
        }
    }, [membershipId, membershipType])
    return { membership, isLoading }
}
