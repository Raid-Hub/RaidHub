import { Collection } from "@discordjs/collection"
import { useMemo } from "react"
import { type RaidHubBaseActivity } from "~/services/raidhub/types"

export const useActivitiesByPartition = <T extends RaidHubBaseActivity>(
    allResults: Collection<string, T>
) => {
    return useMemo(() => {
        const partioned = new Collection<string, Collection<string, T>>()
        allResults.forEach(a => {
            const key = `${new Date(a.dateCompleted).getMonth()}-${new Date(
                a.dateCompleted
            ).getFullYear()}`
            if (partioned.has(key)) {
                partioned.get(key)!.set(a.instanceId, a)
            } else {
                partioned.set(key, new Collection<string, T>([[a.instanceId, a]]))
            }
        })
        return partioned
    }, [allResults])
}