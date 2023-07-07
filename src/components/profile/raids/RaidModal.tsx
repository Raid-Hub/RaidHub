import styles from "../../../styles/profile.module.css"
import { Raid, RaidCardBackground, raidDetailsFromHash } from "../../../util/destiny/raid"
import DotGraph from "./DotGraph"
import { secondsToHMS } from "../../../util/presentation/formatting"
import { DestinyHistoricalStatsPeriodGroup } from "bungie-net-core/lib/models"
import RaidStats from "../../../models/profile/RaidStats"
import { usePrefs } from "../../../hooks/util/usePrefs"
import { Prefs } from "../../../util/profile/preferences"
import { useLocale } from "../../app/LanguageProvider"
import { useEffect, useMemo, useRef, useState } from "react"
import BigNumberStatItem from "./BigNumberStatItem"
import RaidReportData from "../../../models/profile/RaidReportData"
import { medianElement } from "../../../util/math"
import RaidTagLabel from "./RaidTagLabel"

type RaidModalProps = {
    membershipId: string
    raid: Raid
    activities: DestinyHistoricalStatsPeriodGroup[]
    stats: RaidStats | undefined
    report: RaidReportData | undefined
    isLoadingDots: boolean
    isLoadingStats: boolean
    isLoadingReport: boolean
}

const RaidModal = ({
    membershipId,
    raid,
    activities,
    stats,
    report,
    isLoadingDots,
    isLoadingStats,
    isLoadingReport
}: RaidModalProps) => {
    const { strings } = useLocale()
    const prefOptions = useRef([Prefs.FILTER] as const)
    const { isLoading: isLoadingPrefs, prefs } = usePrefs(membershipId, prefOptions.current)
    const [hoveredTag, setHoveredTag] = useState<string | null>(null)

    const averageClear = useMemo(() => {
        if (report?.fastestFullClear?.value) {
            const completions = activities
                .filter(
                    a =>
                        a.values.completed.basic.value &&
                        a.values.activityDurationSeconds.basic.value >=
                            report.fastestFullClear!.value
                )
                .sort(
                    (a, b) =>
                        a.values.activityDurationSeconds.basic.value -
                        b.values.activityDurationSeconds.basic.value
                )
            return medianElement(completions)
        } else {
            return undefined
        }
    }, [activities, report])

    const placementClear = useMemo(() => {
        if (report?.worldFirstPlacement) {
            return activities[0]
        } else {
            return undefined
        }
    }, [activities, report])

    const contestFirstClear = useMemo(() => {
        const first = activities.find(a => !!a.values.completed.basic.value)
        if (!first) return
        const details = raidDetailsFromHash(first.activityDetails.directorActivityHash.toString())
        const end = new Date(
            new Date(first.period).getTime() +
                first.values.activityDurationSeconds.basic.value * 1000
        )
        if (details.isDayOne(end)) {
            return {
                instanceId: first.activityDetails.instanceId,
                raid: raid
            }
        } else if (details.isContest(end)) {
            const start = new Date(first.period)
            return {
                instanceId: first.activityDetails.instanceId,
                raid: raid,
                asterisk: !details.isContest(start)
            }
        }
    }, [activities, raid])

    useEffect(() => {
        // Set a new timeout
        const timer = setTimeout(() => {
            setHoveredTag(null)
        }, 2500)

        return () => {
            clearTimeout(timer)
        }
    }, [hoveredTag])

    return (
        <div className={styles["raid-card"]}>
            <div className={styles["raid-card-img-container"]}>
                <img className={styles["top-image"]} src={RaidCardBackground[raid]} alt="" />
                <div className={styles["img-overlay"]}>
                    <div className={styles["tag-row"]}>
                        {report?.worldFirstPlacement ? (
                            <RaidTagLabel
                                type="race"
                                raid={raid}
                                instanceId={placementClear?.activityDetails.instanceId}
                                placement={report?.worldFirstPlacement ?? undefined}
                                scrollToDot={setHoveredTag}
                            />
                        ) : (
                            contestFirstClear && (
                                <RaidTagLabel
                                    type="race"
                                    {...contestFirstClear}
                                    scrollToDot={setHoveredTag}
                                />
                            )
                        )}
                    </div>
                    <div className={styles["img-overlay-bottom"]}>
                        <div className={styles["card-diamonds"]}>
                            {report?.tags()?.map((tag, key) => (
                                <RaidTagLabel
                                    type="challenge"
                                    {...tag}
                                    key={key}
                                    scrollToDot={setHoveredTag}
                                />
                            ))}
                        </div>
                        <span className={styles["raid-card-title"]}>{strings.raidNames[raid]}</span>
                    </div>
                </div>
            </div>
            <div className={styles["raid-card-content"]}>
                <div className={styles["graph-content"]}>
                    <DotGraph
                        report={report}
                        dots={activities.filter(prefs?.[Prefs.FILTER] ?? (() => true))}
                        isLoading={isLoadingDots || isLoadingReport}
                        targetDot={hoveredTag}
                    />
                    <div className={styles["graph-right"]}>
                        <BigNumberStatItem
                            displayValue={stats?.totalClears ? stats.totalClears : 0}
                            isLoading={isLoadingStats}
                            name={strings.totalClears.split(" ").join("\n")}
                            extraLarge={true}
                        />
                    </div>
                </div>

                <div className={styles["bottom-timings"]}>
                    <BigNumberStatItem
                        displayValue={
                            report?.fastestFullClear
                                ? secondsToHMS(report.fastestFullClear.value)
                                : strings.na
                        }
                        isLoading={isLoadingReport}
                        name={strings.fastestClear}
                        href={
                            report?.fastestFullClear
                                ? `/pgcr/${report.fastestFullClear.instanceId}`
                                : undefined
                        }
                    />

                    <BigNumberStatItem
                        displayValue={
                            averageClear
                                ? averageClear.values.activityDurationSeconds.basic.displayValue
                                : strings.na
                        }
                        isLoading={isLoadingDots}
                        name={strings.averageClear}
                        href={
                            averageClear
                                ? `/pgcr/${averageClear.activityDetails.instanceId}`
                                : undefined
                        }
                    />

                    <BigNumberStatItem
                        displayValue={report?.sherpaCount ? report.sherpaCount : 0}
                        isLoading={isLoadingReport}
                        name={strings.sherpas}
                    />
                </div>
            </div>
        </div>
    )
}

export default RaidModal
