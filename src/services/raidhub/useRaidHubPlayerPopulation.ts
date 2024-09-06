import { useQuery } from "@tanstack/react-query"
import { getRaidHubApi } from "./common"
import { type RaidHubMetricsPopulationRollingDayResponse } from "./types"

export const useRaidHubPlayerPopulation = () =>
    useQuery<RaidHubMetricsPopulationRollingDayResponse, Error>({
        queryKey: ["raidhub", "metrics", "population", "day"],
        queryFn: () =>
            getRaidHubApi("/metrics/population/rolling-day", null, null).then(res => res.response),
        refetchInterval: 30_000
    })
