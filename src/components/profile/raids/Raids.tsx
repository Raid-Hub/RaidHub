import styles from "../../../styles/pages/profile/raids.module.css"
import { useActivityHistory } from "../../../hooks/bungie/useActivityHistory"
import { ListedRaids, Raid } from "../../../types/raids"
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
    const { data, isLoading: isLoadingActivities } = useActivityHistory({
        characterMemberships,
        errorHandler
    })

    useEffect(() => {
        if (data?.allActivities) {
            setMostRecentActivity(
                data.allActivities.find(a => a.completed)?.activityDetails.instanceId ?? null
            )
        }
    }, [data?.allActivities, setMostRecentActivity])

    const allActivitiesFiltered = useMemo(() => {
        if (data?.allActivities && raidReport) {
            return data.allActivities
                .map(
                    a =>
                        raidReport.get(a.raid)?.eveythingFor(a) ?? {
                            activity: a,
                            extended: {
                                fresh: false,
                                playerCount: a.playerCount,
                                flawless: false
                            }
                        }
                )
                .filter(filter)
        } else {
            return null
        }
    }, [filter, data?.allActivities, raidReport])

    switch (layout) {
        case Layout.DotCharts:
            return (
                <div className={styles["cards"]}>
                    {ListedRaids.map((raid, idx) => (
                        <RaidCard
                            stats={raidMetrics?.get(raid)}
                            report={raidReport?.get(raid)}
                            allActivities={data?.activitiesByRaid.get(raid) ?? null}
                            filter={filter}
                            isLoadingStats={isLoadingRaidMetrics}
                            key={idx}
                            raid={raid}
                            isLoadingDots={
                                !data?.allActivities || isLoadingActivities || isLoadingCharacters
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
