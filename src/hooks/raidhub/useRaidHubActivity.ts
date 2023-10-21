import { useQuery } from "@tanstack/react-query"
import { activityQueryKey, getActivity } from "~/services/raidhub/getActivitiy"

export function useRaidHubActivity(activityId: string) {
    return useQuery({
        queryKey: activityQueryKey(activityId),
        queryFn: () => getActivity(activityId),
        staleTime: Infinity
    })
}
