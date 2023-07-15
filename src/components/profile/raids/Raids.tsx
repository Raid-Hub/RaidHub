import styles from "../../../styles/pages/profile/raids.module.css"
import { useActivityHistory } from "../../../hooks/bungie/useActivityHistory"
import { AvailableRaids, Raid } from "../../../types/raids"
import RaidCard from "./RaidCard"
import ActivityTile from "./ActivityTile"
import { useEffect, useMemo, useState } from "react"
import Loading from "../../global/Loading"
import { usePrefs } from "../../../hooks/util/usePrefs"
import { Prefs } from "../../../util/profile/preferences"
import { AllRaidStats, MembershipWithCharacters } from "../../../types/profile"
import { ErrorHandler } from "../../../types/generic"
import { useLocale } from "../../app/LanguageProvider"
import RaidReportDataCollection from "../../../models/profile/RaidReportDataCollection"
import { Layout } from "../Profile"

const CARDS_PER_PAGE = 60

type RaidsProps = {
    membershipId: string
    characterMemberships: MembershipWithCharacters[] | null
    layout: Layout
    raidMetrics: AllRaidStats | null
    raidReport: Map<Raid, RaidReportDataCollection> | null
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
                allActivities.find(a => a.completed)?.activityDetails.instanceId ?? null
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

    switch (layout) {
        case Layout.DotCharts:
            return (
                <div className={styles["cards"]}>
                    {AvailableRaids.map((raid, idx) => (
                        <RaidCard
                            stats={raidMetrics?.get(raid)}
                            report={raidReport?.get(raid)}
                            allActivities={activitiesByRaid?.get(raid) ?? null}
                            filter={prefs?.[Prefs.FILTER] ?? null}
                            isLoadingStats={isLoadingRaidMetrics}
                            key={idx}
                            raid={raid}
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
                                  {Array.from(allActivitiesFiltered.values())
                                      .slice(0, pages * CARDS_PER_PAGE)
                                      .map((activity, key) => (
                                          <ActivityTile
                                              key={key}
                                              activity={activity}
                                              playerCount={
                                                  raidReport
                                                      ?.get(activity.raid)
                                                      ?.get(activity.difficulty)
                                                      ?.lowmanActivities.get(activity.instanceId)
                                                      ?.playerCount
                                              }
                                              flawless={
                                                  raidReport
                                                      ?.get(activity.raid)
                                                      ?.get(activity.difficulty)
                                                      ?.flawlessActivities.get(activity.instanceId)
                                                      ?.fresh
                                              }
                                          />
                                      ))}
                                  {allActivitiesFiltered.size > pages * CARDS_PER_PAGE && (
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
