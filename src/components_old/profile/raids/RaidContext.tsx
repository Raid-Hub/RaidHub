"use client"

import { Collection } from "@discordjs/collection"
import { createContext, useContext, type ReactNode } from "react"
import type { ListedRaid, RaidHubPlayerActivitiesActivity } from "~/types/raidhub-api"

const RaidContext = createContext<
    | {
          raid: ListedRaid
          isLoadingActivities: false
          activities: Collection<string, RaidHubPlayerActivitiesActivity>
      }
    | { raid: ListedRaid; isLoadingActivities: true; activities: null }
    | null
>(null)

export function useActivitiesContext() {
    const ctx = useContext(RaidContext)
    if (!ctx) throw new Error("No RaidContext found")
    return ctx
}

export function RaidCardContext({
    children,
    activitiesByRaid,
    isLoadingActivities,
    raid
}: {
    children: ReactNode
    activitiesByRaid: Collection<
        ListedRaid,
        Collection<string, RaidHubPlayerActivitiesActivity>
    > | null
    isLoadingActivities: boolean
    raid: ListedRaid
}) {
    return (
        <RaidContext.Provider
            value={{
                raid,
                ...(isLoadingActivities
                    ? { isLoadingActivities: true, activities: null }
                    : {
                          isLoadingActivities: false,
                          activities: activitiesByRaid?.get(raid) ?? new Collection()
                      })
            }}>
            {children}
        </RaidContext.Provider>
    )
}
