import styles from "../../../styles/pages/profile/raids.module.css"
import { useActivityHistory } from "../../../hooks/bungie/useActivityHistory"
import { AvailableRaids, Raid } from "../../../types/raids"
import RaidCard from "./RaidCard"
import { useEffect, useMemo } from "react"
import { AllRaidStats, ExtendedActivity, MembershipWithCharacters } from "../../../types/profile"
import { ErrorHandler, FilterCallback } from "../../../types/generic"
import RaidReportDataCollection from "../../../models/profile/data/RaidReportDataCollection"
import { Layout } from "../Profile"
import RecentRaids from "./RecentRaids"

type RaidsProps = {
    membershipId: string
    characterMemberships: MembershipWithCharacters[] | null
    layout: Layout
    filter: FilterCallback<ExtendedActivity>
    raidMetrics: AllRaidStats | null
    raidReport: Map<Raid, RaidReportDataCollection> | null
    isLoadingRaidMetrics: boolean
    isLoadingRaidReport: boolean
    isLoadingCharacters: boolean
    setMostRecentActivity: (id: string | null) => void
    errorHandler: ErrorHandler
}

const Raids = ({
    membershipId: destinyMembershipId,
    characterMemberships,
    layout,
    filter,
    raidMetrics,
    raidReport,
    isLoadingRaidMetrics,
    isLoadingRaidReport,
    isLoadingCharacters,
    setMostRecentActivity,
    errorHandler
}: RaidsProps) => {
    const {
        allActivities,
        activitiesByRaid,
        isLoading: isLoadingActivities
    } = useActivityHistory({
        characterMemberships,
        errorHandler
    })

    useEffect(() => {
        if (allActivities) {
            setMostRecentActivity(
                allActivities.find(a => a.completed)?.activityDetails.instanceId ?? null
            )
        }
    }, [allActivities, setMostRecentActivity])

    const allActivitiesFiltered = useMemo(() => {
        if (allActivities && raidReport) {
            return allActivities.map(a => raidReport.get(a.raid)!.eveythingFor(a)).filter(filter)
        } else {
            return null
        }
    }, [filter, allActivities, raidReport])

    switch (layout) {
        case Layout.DotCharts:
            return (
                <div className={styles["cards"]}>
                    {AvailableRaids.map((raid, idx) => (
                        <RaidCard
                            stats={raidMetrics?.get(raid)}
                            report={raidReport?.get(raid)}
                            allActivities={activitiesByRaid?.get(raid) ?? null}
                            filter={filter}
                            isLoadingStats={isLoadingRaidMetrics}
                            key={idx}
                            raid={raid}
                            isLoadingDots={
                                !allActivities || isLoadingActivities || isLoadingCharacters
                            }
                            isLoadingReport={isLoadingRaidReport}
                        />
                    ))}
                </div>
            )
        case Layout.RecentActivities:
            return (
                <RecentRaids
                    isLoading={isLoadingActivities || isLoadingCharacters}
                    allActivitiesFiltered={allActivitiesFiltered}
                    raidReport={raidReport}
                />
            )
    }
}

export default Raids
