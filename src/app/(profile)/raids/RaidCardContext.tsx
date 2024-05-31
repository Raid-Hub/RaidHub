"use client"

import { Collection } from "@discordjs/collection"
import { createContext, useContext, type ReactNode } from "react"
import { type RaidHubInstanceForPlayer } from "~/services/raidhub/types"

const RaidContext = createContext<
    | {
          raidId: number
          isLoadingActivities: false
          activities: Collection<string, RaidHubInstanceForPlayer>
      }
    | { raidId: number; isLoadingActivities: true; activities: null }
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
    raidId
}: {
    children: ReactNode
    activities: Collection<string, RaidHubInstanceForPlayer> | undefined
    isLoadingActivities: boolean
    raidId: number
}) => (
    <RaidContext.Provider
        value={{
            raidId,
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
