import { RaidHubProfile } from "../../types/profile"
import { getRaidHubProfile } from "../../services/raidhub/getProfile"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { ErrorHandler } from "../../types/generic"
import { useEffect, useState } from "react"

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

    useEffect(() => {
        setIsLoading(true)

        getProfile()
        async function getProfile() {
            try {
                const profile = await getRaidHubProfile(destinyMembershipId)
                setProfile(profile)
            } catch (e) {
                CustomError.handle(errorHandler, e, ErrorCode.RaidHubProfile)
            } finally {
                setIsLoading(false)
            }
        }
    }, [destinyMembershipId, errorHandler])
    return { profile, isLoading }
}
