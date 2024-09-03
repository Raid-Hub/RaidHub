import { useQuery } from "@tanstack/react-query"
import { getRaidHubApi } from "./common"
import { type RaidHubStatusResponse } from "./types"

export const useRaidHubStatus = () =>
    useQuery<RaidHubStatusResponse, Error>({
        queryKey: ["raidhub", "status"],
        queryFn: () => getRaidHubApi("/status", null, null).then(res => res.response),
        staleTime: 10000,
        refetchOnReconnect: true,
        refetchOnMount: true,
        refetchIntervalInBackground: false,
        retry: 3,
        refetchInterval: data => {
            if (!data) return 60000

            switch (data.AtlasPGCR.status) {
                case "Crawling":
                    if (
                        data.AtlasPGCR.medianSecondsBehindNow &&
                        data.AtlasPGCR.medianSecondsBehindNow > 60
                    ) {
                        return 30_000
                    }
                    return 120_000
                case "Idle":
                    return 300_000
                case "Offline":
                    return 45_000
                default:
                    return 60_000
            }
        }
    })
