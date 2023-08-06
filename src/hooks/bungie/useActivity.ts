import { ErrorHandler } from "../../types/generic"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { getPGCR } from "../../services/bungie/getPGCR"
import { useBungieClient } from "../../components/app/TokenManager"
import { useQuery } from "@tanstack/react-query"

export function useActivity({
    activityId,
    errorHandler
}: {
    activityId: string
    errorHandler: ErrorHandler
}) {
    const client = useBungieClient()
    return useQuery({
        queryKey: ["activity", activityId],
        onError: e => CustomError.handle(errorHandler, e, ErrorCode.ActivityError),
        queryFn: () => getPGCR({ activityId, client }),
        staleTime: Infinity // pgcr's should never change once we get their id
    })
}
