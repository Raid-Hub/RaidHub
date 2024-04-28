"use client"

import { Collection } from "@discordjs/collection"
import { createContext, useContext, type ReactNode } from "react"
import type {
    ListedRaid,
    PantheonId,
    RaidHubPlayerActivitiesActivity
} from "~/services/raidhub/types"

const RaidContext = createContext<
    | {
          raid: ListedRaid | PantheonId
          isLoadingActivities: false
          activities: Collection<string, RaidHubPlayerActivitiesActivity>
      }
    | { raid: ListedRaid | PantheonId; isLoadingActivities: true; activities: null }
    | null
>(null)

export function useRaidCardContext() {
    const ctx = useContext(RaidContext)
    if (!ctx) throw new Error("No RaidContext found")
    return ctx
}

export const RaidCardContext = ({
    children,
    activities = new Collection(),
    isLoadingActivities,
    raid
}: {
    children: ReactNode
    activities: Collection<string, RaidHubPlayerActivitiesActivity> | undefined
    isLoadingActivities: boolean
    raid: ListedRaid | PantheonId
}) => (
    <RaidContext.Provider
        value={{
            raid,
            ...(isLoadingActivities
                ? { isLoadingActivities: true, activities: null }
                : {
                      isLoadingActivities: false,
                      activities
                  })
        }}>
        {children}
    </RaidContext.Provider>
)
