import styles from "../../../styles/pages/profile/raids.module.css"
import {
    Difficulty,
    Raid,
    RaidCardBackground,
    ReprisedContestDifficultyDictionary,
    ReprisedContestRaidDifficulties,
    isContest,
    isDayOne,
    isWeekOne,
    raidTupleFromHash
} from "../../../util/destiny/raid"
import DotGraphWrapper from "./DotGraph"
import { secondsToHMS } from "../../../util/presentation/formatting"
import { DestinyHistoricalStatsPeriodGroup } from "bungie-net-core/lib/models"
import RaidStats from "../../../models/profile/RaidStats"
import { useLocale } from "../../app/LanguageProvider"
import { useEffect, useMemo, useState } from "react"
import BigNumberStatItem from "./BigNumberStatItem"
import RaidReportData from "../../../models/profile/RaidReportData"
import { medianElement } from "../../../util/math"
import RaidTagLabel, { RaceTag } from "./RaidTagLabel"

type RaidModalProps = {
    raid: Raid
    activities: DestinyHistoricalStatsPeriodGroup[]
    stats: RaidStats | undefined
    report: RaidReportData | undefined
    isLoadingDots: boolean
    isLoadingStats: boolean
    isLoadingReport: boolean
}

const RaidModal = ({
    raid,
    activities,
    stats,
    report,
    isLoadingDots,
    isLoadingStats,
    isLoadingReport
}: RaidModalProps) => {
    const { strings } = useLocale()
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

    const contestFirstClear: (RaceTag & { instanceId?: string }) | null = useMemo(() => {
        const contestDifficulty:
            | (typeof ReprisedContestRaidDifficulties)[number]
            | Difficulty.NORMAL =
            // @ts-ignore
            ReprisedContestDifficultyDictionary[raid] ?? Difficulty.NORMAL
        const first = activities.find(
            a =>
                !!a.values.completed.basic.value &&
                raidTupleFromHash(a.activityDetails.directorActivityHash.toString())[1] ===
                    contestDifficulty
        )
        const isChallenge = contestDifficulty !== Difficulty.NORMAL
        if (!first) {
            return report?.worldFirstPlacement
                ? {
                      raid,
                      challenge: isChallenge,
                      dayOne: false,
                      contest: false,
                      weekOne: false
                  }
                : null
        }
        const end = new Date(
            new Date(first.period).getTime() +
                first.values.activityDurationSeconds.basic.value * 1000
        )
        const start = new Date(first.period)
        const contest = isContest(raid, start)
        const weekOne = isWeekOne(raid, end)
        if (!contest && !weekOne) {
            return null
        } else {
            return {
                raid,
                dayOne: isDayOne(raid, end),
                challenge: isChallenge,
                contest,
                weekOne,
                asterisk: contest && !isContest(raid, end), // completed after contest was over
                instanceId: first.activityDetails.instanceId
            } as RaceTag & { instanceId: string }
        }
    }, [activities, raid, report?.worldFirstPlacement])

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
        <div className={styles["card"]}>
            <div className={styles["card-img-container"]}>
                <img className={styles["card-background"]} src={RaidCardBackground[raid]} alt="" />
                <div className={styles["img-overlay"]}>
                    <div className={styles["tag-row"]}>
                        {contestFirstClear && (
                            <RaidTagLabel
                                type="race"
                                {...contestFirstClear}
                                placement={report?.worldFirstPlacement ?? undefined}
                                scrollToDot={setHoveredTag}
                            />
                        )}
                    </div>
                    <div className={styles["img-overlay-bottom"]}>
                        <div className={styles["card-challenge-tags"]}>
                            {report?.tags()?.map((tag, key) => (
                                <RaidTagLabel
                                    type="challenge"
                                    {...tag}
                                    key={key}
                                    scrollToDot={setHoveredTag}
                                />
                            ))}
                        </div>
                        <span className={styles["card-title"]}>{strings.raidNames[raid]}</span>
                    </div>
                </div>
            </div>
            <div className={styles["card-content"]}>
                <div className={styles["graph-content"]}>
                    <DotGraphWrapper
                        isLoading={isLoadingDots}
                        report={report}
                        dots={activities}
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

                <div className={styles["timings"]}>
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
