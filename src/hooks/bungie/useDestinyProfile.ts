import { BungieMembershipType } from "bungie-net-core/models"
import { ErrorHandler } from "../../types/generic"
import { getDestinyProfile } from "../../services/bungie/getProfile"
import { useCallback, useEffect, useState } from "react"
import { useBungieClient } from "./useBungieClient"
import { ProfileComponent } from "../../types/profile"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"

type UseDestinyProfileParams = {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    errorHandler: ErrorHandler
}

type UseDestinyProfile = {
    profile: ProfileComponent | null
    isLoading: boolean
}

export const useDestinyProfile = ({
    destinyMembershipId,
    membershipType,
    errorHandler
}: UseDestinyProfileParams): UseDestinyProfile => {
    const [profile, setProfile] = useState<ProfileComponent | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    const client = useBungieClient()

    const fetchData = useCallback(
        async (destinyMembershipId: string, membershipType: BungieMembershipType) => {
            return getDestinyProfile({ destinyMembershipId, membershipType, client })
        },
        [client]
    )

    useEffect(() => {
        setLoading(true)
        getClan()

        async function getClan() {
            try {
                const profile = await fetchData(destinyMembershipId, membershipType)
                setProfile(profile)
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.Clan)
            } finally {
                setLoading(false)
            }
        }
    }, [destinyMembershipId, membershipType, errorHandler, fetchData])
    return { profile, isLoading }
}
