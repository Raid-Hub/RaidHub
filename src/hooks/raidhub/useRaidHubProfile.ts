import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { ErrorHandler } from "../../types/generic"
import { getRaidHubProfile } from "../../services/app/getProfile"
import { useQuery } from "@tanstack/react-query"

export function useRaidHubProfile({
    destinyMembershipId,
    errorHandler
}: {
    destinyMembershipId: string
    errorHandler: ErrorHandler
}) {
    return useQuery({
        queryKey: ["raidhubProfile", destinyMembershipId],
        onError: e => CustomError.handle(errorHandler, e, ErrorCode.RaidHubProfile),
        queryFn: () => getRaidHubProfile(destinyMembershipId),
        staleTime: 30_000
    })
}
