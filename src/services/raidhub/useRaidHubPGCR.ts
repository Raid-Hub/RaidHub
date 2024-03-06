import { useQuery } from "@tanstack/react-query"
import { getRaidHubApi } from "./common"

export const useRaidHubPGCR = (instanceId: string) =>
    useQuery({
        queryKey: ["raidhub", "pgcr", instanceId] as const,
        queryFn: ({ queryKey }) =>
            getRaidHubApi("/pgcr/{instanceId}", { instanceId: queryKey[2] }, null),
        staleTime: 3600_000
    })
