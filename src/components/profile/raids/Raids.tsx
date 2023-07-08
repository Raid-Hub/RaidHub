import styles from "../../../styles/pages/profile/raids.module.css"
import { DestinyHistoricalStatsPeriodGroup } from "bungie-net-core/lib/models"
import { useActivityHistory } from "../../../hooks/bungie/useActivityHistory"
import { AllRaids, Raid, raidTupleFromHash } from "../../../util/destiny/raid"
import RaidCard from "./RaidCard"
import ActivityTile from "./ActivityTile"
import { useEffect, useMemo, useState } from "react"
import Loading from "../../global/Loading"
import { usePrefs } from "../../../hooks/util/usePrefs"
import { Prefs } from "../../../util/profile/preferences"
import { AllRaidStats, MembershipWithCharacters } from "../../../types/profile"
import { ErrorHandler } from "../../../types/generic"
import { useLocale } from "../../app/LanguageProvider"
import RaidReportData from "../../../models/profile/RaidReportData"
import { Layout } from "../Profile"

const CARDS_PER_PAGE = 60

type RaidsProps = {
    membershipId: string
    characterMemberships: MembershipWithCharacters[] | null
    layout: Layout
    raidMetrics: AllRaidStats | null
    raidReport: Map<Raid, RaidReportData> | null
    isLoadingRaidMetrics: boolean
    isLoadingRaidReport: boolean
    isLoadingCharacters: boolean
    setMostRecentActivity: (id: string | null) => void
    errorHandler: ErrorHandler
}

const prefOptions = [Prefs.FILTER] as const

const Raids = ({
    membershipId: destinyMembershipId,
    characterMemberships,
    layout,
    raidMetrics,
    raidReport,
    isLoadingRaidMetrics,
    isLoadingRaidReport,
    isLoadingCharacters,
    setMostRecentActivity,
    errorHandler
}: RaidsProps) => {
    const { strings } = useLocale()
    const { prefs, isLoading: isLoadingPrefs } = usePrefs(destinyMembershipId, prefOptions)
    const {
        allActivities,
        activitiesByRaid,
        isLoading: isLoadingActivities
    } = useActivityHistory({
        characterMemberships,
        errorHandler
    })
    const [pages, setPages] = useState<number>(1)

    useEffect(() => {
        if (allActivities) {
            setMostRecentActivity(
                allActivities.find(a => !!a.values.completed.basic.value)?.activityDetails
                    .instanceId ?? null
            )
        }
    }, [allActivities, setMostRecentActivity])

    const allActivitiesFiltered = useMemo(() => {
        if (prefs && allActivities) {
            return allActivities.filter(prefs[Prefs.FILTER])
        } else {
            return null
        }
    }, [prefs, allActivities])

    const activitiesByRaidFiltered = useMemo(() => {
        if (prefs && activitiesByRaid) {
            const filtered = new Map<Raid, DestinyHistoricalStatsPeriodGroup[]>()
            for (const [raid, collection] of Object.entries(activitiesByRaid)) {
                filtered.set(parseInt(raid), collection.filter(prefs[Prefs.FILTER]).toJSON())
            }
            return filtered
        } else {
            return null
        }
    }, [prefs, activitiesByRaid])

    switch (layout) {
        case Layout.DotCharts:
            return (
                <div className={styles["cards"]}>
                    {AllRaids.map((raid, idx) => (
                        <RaidCard
                            stats={raidMetrics?.get(raid)}
                            report={raidReport?.get(raid)}
                            isLoadingStats={isLoadingRaidMetrics}
                            key={idx}
                            raid={raid}
                            activities={activitiesByRaidFiltered?.get(raid) ?? []}
                            isLoadingDots={
                                !allActivities ||
                                isLoadingActivities ||
                                isLoadingPrefs ||
                                isLoadingCharacters
                            }
                            isLoadingReport={isLoadingRaidReport}
                        />
                    ))}
                </div>
            )
        case Layout.RecentActivities:
            return (
                <div className={styles["recent"]}>
                    {isLoadingActivities || isLoadingCharacters || isLoadingPrefs
                        ? Array(CARDS_PER_PAGE)
                              .fill(null)
                              .map((_, key) => (
                                  <Loading key={key} wrapperClass={styles["placeholder"]} />
                              ))
                        : allActivitiesFiltered && (
                              <>
                                  {allActivitiesFiltered
                                      .slice(0, pages * CARDS_PER_PAGE)
                                      .map(({ activityDetails, values, period }, key) => (
                                          <ActivityTile
                                              key={key}
                                              info={raidTupleFromHash(
                                                  activityDetails.referenceId.toString()
                                              )}
                                              completed={!!values.completed.basic.value}
                                              activityId={activityDetails.instanceId}
                                              startDate={
                                                  new Date(
                                                      new Date(period).getTime() +
                                                          values.activityDurationSeconds.basic.value
                                                  )
                                              }
                                              completionDate={new Date(period)}
                                          />
                                      ))}
                                  {allActivitiesFiltered.length > pages * CARDS_PER_PAGE && (
                                      <button
                                          className={styles["load-more"]}
                                          onClick={() => setPages(pages + 1)}>
                                          <span>{strings.loadMore}</span>
                                      </button>
                                  )}
                              </>
                          )}
                </div>
            )
    }
}

export default Raids
