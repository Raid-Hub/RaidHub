import { BungieMembershipType } from "bungie-net-core/lib/models"
import { ErrorHandler } from "../../types/generic"
import { getDestinyProfile } from "../../services/bungie/getProfile"
import { useCallback, useEffect, useState } from "react"
import { useBungieClient } from "../../components/app/TokenManager"
import { ProfileComponent } from "../../types/profile"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"

type UseDestinyProfileParams = {
    destinyMembershipId: string
    destinyMembershipType: BungieMembershipType
    errorHandler: ErrorHandler
}

type UseDestinyProfile = {
    profile: ProfileComponent | null
    isLoading: boolean
}

export const useDestinyProfile = ({
    destinyMembershipId,
    destinyMembershipType,
    errorHandler
}: UseDestinyProfileParams): UseDestinyProfile => {
    const [profile, setProfile] = useState<ProfileComponent | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)
    const client = useBungieClient()

    const fetchData = useCallback(
        async (destinyMembershipId: string, membershipType: BungieMembershipType) => {
            try {
                setProfile(null)
                const profile = await getDestinyProfile({
                    destinyMembershipId,
                    membershipType,
                    client
                })
                setProfile(profile)
            } catch (e: any) {
                setError(e)
            } finally {
                setLoading(false)
            }
        },
        [client]
    )

    useEffect(() => {
        error && CustomError.handle(errorHandler, error, ErrorCode.Clan)
    }, [error, errorHandler])

    useEffect(() => {
        setLoading(true)
        fetchData(destinyMembershipId, destinyMembershipType)
    }, [destinyMembershipId, destinyMembershipType, fetchData])
    return { profile, isLoading }
}
