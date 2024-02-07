import { useQuery } from "@tanstack/react-query"
import { RaidHubActivityResponse } from "~/types/raidhub-api"
import { getRaidHubApi } from "."

export const useRaidHubActivity = (activityId: string, initialData?: RaidHubActivityResponse) =>
    useQuery({
        queryKey: ["raidhub", "activity", activityId] as const,
        queryFn: ({ queryKey }) =>
            getRaidHubApi("/activity/{instanceId}", { instanceId: queryKey[2] }, null),
        staleTime: 3600_000,
        initialData: initialData
    })
