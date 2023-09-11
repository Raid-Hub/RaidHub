import styles from "~/styles/pages/profile/raids.module.css"
import { ListedRaids, Raid } from "~/types/raids"
import RaidCard from "./RaidCard"
import { useEffect, useMemo } from "react"
import { AllRaidStats, ExtendedActivity, CharacterWithMembership } from "~/types/profile"
import { FilterCallback } from "~/types/generic"

import RecentRaids from "./RecentRaids"
import { Layout } from "../mid/LayoutToggle"
import { useBungieClient } from "~/components/app/TokenManager"

type RaidsProps = {
    characterMemberships: CharacterWithMembership[]
    layout: Layout
    filter: FilterCallback<ExtendedActivity>
    setMostRecentActivity: (id: string | null | undefined) => void
}

const Raids = ({
    characterMemberships,
    layout,
    filter,
    raidMetrics,
    isLoadingRaidMetrics,
    isLoadingCharacters,
    setMostRecentActivity
}: RaidsProps) => {
    const bungie = useBungieClient()
    const { data, isLoading: isLoadingActivities } = bungie.activityHistory.useQuery(
        characterMemberships,
        { staleTime: 60_000, enabled: !!characterMemberships.length }
    )

    useEffect(() => {
        if (data?.allActivities) {
            setMostRecentActivity(
                data.allActivities.find(a => a.completed)?.activityDetails.instanceId ?? null
            )
        } else {
            setMostRecentActivity(undefined)
        }
    }, [data?.allActivities, setMostRecentActivity])

    const allActivitiesFiltered = useMemo(() => {
        return null
    }, [filter, data?.allActivities])

    switch (layout) {
        case Layout.DotCharts:
            return (
                <div className={styles["cards"]}>
                    {ListedRaids.map((raid, idx) => (
                        <RaidCard
                            stats={raidMetrics?.get(raid)}
                            allActivities={data?.activitiesByRaid.get(raid) ?? null}
                            filter={filter}
                            isLoadingStats={isLoadingRaidMetrics}
                            key={idx}
                            raid={raid}
                            isLoadingDots={
                                !data?.allActivities || isLoadingActivities || isLoadingCharacters
                            }
                        />
                    ))}
                </div>
            )
        case Layout.RecentActivities:
            return (
                <RecentRaids
                    isLoading={isLoadingActivities || isLoadingCharacters}
                    allActivitiesFiltered={allActivitiesFiltered}
                />
            )
    }
}

export default Raids
