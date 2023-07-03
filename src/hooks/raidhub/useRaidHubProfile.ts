import { RaidHubProfile } from "../../types/profile"
import { getRaidHubProfile } from "../../services/raidhub/getProfile"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { ErrorHandler } from "../../types/generic"
import { useCallback, useEffect, useState } from "react"

type UseRaidHubProfileParams = {
    destinyMembershipId: string
    errorHandler: ErrorHandler
}

type UseRaidHubProfile = {
    profile: RaidHubProfile | null
    isLoading: boolean
}

export function useRaidHubProfile({
    destinyMembershipId,
    errorHandler
}: UseRaidHubProfileParams): UseRaidHubProfile {
    const [profile, setProfile] = useState<RaidHubProfile | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const fetchData = useCallback(async (id: string) => {
        try {
            const profile = await getRaidHubProfile(id)
            setProfile(profile)
        } catch (e) {
            CustomError.handle(errorHandler, e, ErrorCode.RaidHubProfile)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        setIsLoading(true)
        fetchData(destinyMembershipId)
    }, [destinyMembershipId, errorHandler])
    return { profile, isLoading }
}
