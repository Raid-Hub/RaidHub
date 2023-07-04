import { useCallback, useEffect, useState } from "react"
import {
    BungieMembershipType,
    DestinyProfileUserInfoCard,
    UserInfoCard
} from "bungie-net-core/lib/models"
import { ErrorHandler } from "../../types/generic"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { getLinkedBungieProfiles } from "../../services/bungie/getLinkedBungieProfiles"
import { ProfileDetails } from "../../types/profile"

type UseBungieProfile = (params: {
    destinyMembershipId: string
    membershipType: BungieMembershipType
    errorHandler: ErrorHandler
}) => {
    membership: UserInfoCard | null
    destinyProfiles: ProfileDetails[] | null
    isLoading: boolean
}

export const useBungieMemberships: UseBungieProfile = ({
    destinyMembershipId,
    membershipType,
    errorHandler
}) => {
    const [membership, setMembership] = useState<UserInfoCard | null>(null)
    const [destinyProfiles, setDestinyProfiles] = useState<ProfileDetails[] | null>(null)
    const [isLoading, setLoading] = useState<boolean>(true)
    const client = useBungieClient()

    const fetchData = useCallback(
        async (membershipId: string, membershipType: BungieMembershipType) => {
            try {
                setMembership(null)
                setDestinyProfiles(null)
                const { bnetMembership, profiles } = await getLinkedBungieProfiles({
                    membershipId,
                    membershipType,
                    client
                })
                setMembership(bnetMembership)
                setDestinyProfiles(
                    profiles
                        .filter(profile => new Date(profile.dateLastPlayed).getTime())
                        .map(({ membershipId, membershipType }) => ({
                            membershipType,
                            destinyMembershipId: membershipId
                        }))
                )
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
    return { membership, destinyProfiles, isLoading }
}
