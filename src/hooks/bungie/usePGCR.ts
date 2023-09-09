import { ErrorHandler, Loading } from "../../types/generic"
import CustomError, { ErrorCode } from "../../models/errors/CustomError"
import { useBungieClient } from "../../components/app/TokenManager"
import { hydratePGCR } from "../../services/bungie/hydratePGCR"
import { useQuery } from "@tanstack/react-query"

export function usePGCR({
    activityId,
    errorHandler
}: {
    activityId: string
    errorHandler: ErrorHandler
}) {
    const bungie = useBungieClient()
    const activity = bungie.pgcr.useQuery({ activityId }, { staleTime: Infinity })

    const pgcr = useQuery({
        queryKey: ["pgcr", activity.data?.activityDetails.instanceId, bungie.getToken()],
        onError: e => CustomError.handle(errorHandler, e, ErrorCode.PGCR),
        queryFn: () =>
            activity.data ? hydratePGCR({ activity: activity.data, client: bungie }) : null,
        staleTime: 5 * 60000 // pgcr's should never change once we get their id, but hydration data might
    })

    return pgcr.data
        ? { ...pgcr, loadingState: Loading.FALSE }
        : { ...activity, loadingState: activity.isLoading ? Loading.LOADING : Loading.HYDRATING }
}
