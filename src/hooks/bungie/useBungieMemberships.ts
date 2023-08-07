import { useCallback } from "react"
import { BungieMembershipType } from "bungie-net-core/lib/models"
import { ErrorHandler } from "../../types/generic"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { getLinkedBungieProfiles } from "../../services/bungie/getLinkedBungieProfiles"

import { useQuery } from "@tanstack/react-query"

export const useBungieMemberships = ({
    destinyMembershipId,
    destinyMembershipType,
    errorHandler
}: {
    destinyMembershipId: string
    destinyMembershipType: BungieMembershipType
    errorHandler: ErrorHandler
}) => {
    const client = useBungieClient()

    const fetchData = useCallback(
        async (membershipId: string, membershipType: BungieMembershipType) => {
            const { bnetMembership, profiles } = await getLinkedBungieProfiles({
                membershipId,
                membershipType,
                client
            })

            const destinyMemberships = profiles
                .filter(profile => new Date(profile.dateLastPlayed).getTime())
                .map(({ membershipId, membershipType }) => ({
                    membershipType,
                    destinyMembershipId: membershipId
                }))
            return { bungieMembership: bnetMembership, destinyMemberships }
        },
        [client]
    )

    return useQuery({
        queryKey: ["bungieMemberships", destinyMembershipId, destinyMembershipType],
        onError: e => CustomError.handle(errorHandler, e, ErrorCode.BungieNextMembership),
        queryFn: () => fetchData(destinyMembershipId, destinyMembershipType),
        staleTime: 10 * 60000 // profiles do not change very often
    })
}
