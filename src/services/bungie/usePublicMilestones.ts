import { useQuery } from "@tanstack/react-query"
import { getPublicMilestones } from "bungie-net-core/endpoints/Destiny2"
import { DestinyPublicMilestone } from "bungie-net-core/models"
import { useBungieClient } from "~/app/managers/session/BungieClientProvider"

export const usePublicMilestones = <T = { [key: number]: DestinyPublicMilestone }>(opts?: {
    select?: (data: { [key: number]: DestinyPublicMilestone }) => T
    refetchInterval?: (data?: T) => number | false
}) => {
    const bungieClient = useBungieClient()

    return useQuery({
        queryKey: ["bungie", "public milestones"] as const,
        queryFn: () => getPublicMilestones(bungieClient).then(res => res.Response),
        ...opts
    })
}
