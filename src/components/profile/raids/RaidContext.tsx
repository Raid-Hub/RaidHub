import { Collection } from "@discordjs/collection"
import { ReactNode, createContext, useContext } from "react"
import Activity from "~/models/profile/data/Activity"
import { ListedRaid } from "~/types/raids"

const RaidContext = createContext<
    | {
          isLoadingActivities: false
          activities: Collection<string, Activity>
      }
    | { isLoadingActivities: true; activities: null }
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
    activitiesByRaid: Collection<ListedRaid, Collection<string, Activity>> | null
    isLoadingActivities: boolean
    raid: ListedRaid
}) {
    return (
        <RaidContext.Provider
            value={{
                ...(isLoadingActivities
                    ? {
                          isLoadingActivities: true,
                          activities: null
                      }
                    : {
                          isLoadingActivities: false,
                          activities: activitiesByRaid?.get(raid) ?? new Collection()
                      })
            }}>
            {children}
        </RaidContext.Provider>
    )
}