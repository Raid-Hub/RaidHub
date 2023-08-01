import { useCallback, useEffect, useState } from "react"
import { BungieMembershipType, UserInfoCard } from "bungie-net-core/lib/models"
import { ErrorHandler } from "../../types/generic"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { getLinkedBungieProfiles } from "../../services/bungie/getLinkedBungieProfiles"
import { ProfileDetails } from "../../types/profile"

type UseBungieProfile = (params: {
    destinyMembershipId: string
    destinyMembershipType: BungieMembershipType
    errorHandler: ErrorHandler
}) => {
    bungieMemberhip: UserInfoCard | null
    destinyMemberships: ProfileDetails[] | null
    isLoading: boolean
}

export const useBungieMemberships: UseBungieProfile = ({
    destinyMembershipId,
    destinyMembershipType,
    errorHandler
}) => {
    const [bungieMemberhip, setBungieMembership] = useState<UserInfoCard | null>(null)
    const [destinyMemberships, setDestinyMemberships] = useState<ProfileDetails[] | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<Error | null>(null)
    const client = useBungieClient()

    const fetchData = useCallback(
        async (membershipId: string, membershipType: BungieMembershipType) => {
            try {
                setBungieMembership(null)
                setDestinyMemberships(null)
                const { bnetMembership, profiles } = await getLinkedBungieProfiles({
                    membershipId,
                    membershipType,
                    client
                })
                setBungieMembership(bnetMembership)
                setDestinyMemberships(
                    profiles
                        .filter(profile => new Date(profile.dateLastPlayed).getTime())
                        .map(({ membershipId, membershipType }) => ({
                            membershipType,
                            destinyMembershipId: membershipId
                        }))
                )
            } catch (e: any) {
                setError(e)
            } finally {
                setLoading(false)
            }
        },
        [client]
    )

    useEffect(() => {
        error && CustomError.handle(errorHandler, error, ErrorCode.BungieNextMembership)
    }, [error, errorHandler])

    useEffect(() => {
        setLoading(true)
        fetchData(destinyMembershipId, destinyMembershipType)
    }, [destinyMembershipId, destinyMembershipType, fetchData])
    return { bungieMemberhip, destinyMemberships, isLoading }
}
