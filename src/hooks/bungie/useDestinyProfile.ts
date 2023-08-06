import { BungieMembershipType } from "bungie-net-core/lib/models"
import { ErrorHandler } from "../../types/generic"
import { getDestinyProfile } from "../../services/bungie/getProfile"
import { useCallback, useEffect, useState } from "react"
import { useBungieClient } from "../../components/app/TokenManager"
import { ProfileComponent } from "../../types/profile"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useQuery } from "@tanstack/react-query"

export const useDestinyProfile = ({
    destinyMembershipId,
    destinyMembershipType,
    errorHandler
}: {
    destinyMembershipId: string
    destinyMembershipType: BungieMembershipType
    errorHandler: ErrorHandler
}) => {
    const client = useBungieClient()

    return useQuery({
        queryKey: ["destinyProfile", destinyMembershipId, destinyMembershipType],
        onError: e => CustomError.handle(errorHandler, e, ErrorCode.DestinyProfile),
        queryFn: () =>
            getDestinyProfile({
                destinyMembershipId,
                membershipType: destinyMembershipType,
                client
            }),
        staleTime: 10 * 60000 // profile can update often, but we really only care about emblem and name
    })
}
