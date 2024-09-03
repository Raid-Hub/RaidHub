import { useQuery } from "@tanstack/react-query"
import { getRaidHubApi } from "./common"
import { type RaidHubMetricsWeaponsRollingWeekResponse } from "./types"

export const useRaidHubWeeklyWeaponMeta = ({
    sort,
    count
}: {
    sort: "kills" | "usage"
    count: number
}) =>
    useQuery<RaidHubMetricsWeaponsRollingWeekResponse, Error>({
        queryKey: ["raidhub", "metrics", "weapons", "week", sort, count],
        queryFn: () =>
            getRaidHubApi("/metrics/weapons/rolling-week", null, {
                sort,
                count
            }).then(res => res.response),
        staleTime: 60000
    })
