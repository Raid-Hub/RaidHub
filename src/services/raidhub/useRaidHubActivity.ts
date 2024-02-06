import { useQuery } from "@tanstack/react-query"
import { activityQueryKey, getActivity } from "~/services/raidhub/getActivitiy"
import { RaidHubActivityResponse } from "~/types/raidhub-api"

export function useRaidHubActivity(activityId: string, initialData?: RaidHubActivityResponse) {
    return useQuery({
        queryKey: activityQueryKey(activityId),
        queryFn: () => getActivity(activityId),
        staleTime: 3600_000,
        initialData: initialData
    })
}
