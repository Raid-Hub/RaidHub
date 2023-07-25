import styles from "../../../styles/pages/profile/raids.module.css"
import {
    AvailableRaid,
    Difficulty,
    ReprisedContestDifficultyDictionary,
    ReprisedContestRaidDifficulties
} from "../../../types/raids"
import DotGraphWrapper from "./DotGraph"
import { secondsToHMS } from "../../../util/presentation/formatting"
import RaidStatsCollection from "../../../models/profile/data/RaidStatsCollection"
import { useLocale } from "../../app/LanguageProvider"
import { useEffect, useMemo, useState } from "react"
import BigNumberStatItem from "./BigNumberStatItem"
import RaidReportDataCollection from "../../../models/profile/data/RaidReportDataCollection"
import { medianElement } from "../../../util/math"
import RaidTagLabel, { RaceTag } from "./RaidTagLabel"
import { isContest, isDayOne, isWeekOne } from "../../../util/destiny/raid"
import { Collection } from "@discordjs/collection"
import ActivityCollection from "../../../models/profile/data/ActivityCollection"
import { FilterCallback } from "../../../types/generic"
import Image from "next/image"
import RaidCardBackground from "../../../images/raid-backgrounds"
import { motion } from "framer-motion"
import { ExtendedActivity } from "../../../types/profile"

type RaidModalProps = {
    raid: AvailableRaid
    allActivities: ActivityCollection | null
    filter: FilterCallback<ExtendedActivity>
    stats: RaidStatsCollection | undefined
    report: RaidReportDataCollection | undefined
    isLoadingDots: boolean
    isLoadingStats: boolean
    isLoadingReport: boolean
}

const RaidCard = ({
    raid,
    allActivities,
    filter,
    stats,
    report,
    isLoadingDots,
    isLoadingStats,
    isLoadingReport
}: RaidModalProps) => {
    const { strings } = useLocale()
    const [hoveredTag, setHoveredTag] = useState<string | null>(null)

    const averageClear = useMemo(() => {
        if (report?.fastestFullClear?.value && allActivities) {
            const completions = allActivities.all
                .filter(a => a.completed && a.durationSeconds >= report.fastestFullClear!.value)
                .sort((a, b) => a.durationSeconds - b.durationSeconds)
            return medianElement(completions)
        } else {
            return undefined
        }
    }, [allActivities, report])

    const contestFirstClear: (RaceTag & { instanceId?: string }) | null = useMemo(() => {
        const contestDifficulty:
            | (typeof ReprisedContestRaidDifficulties)[number]
            | Difficulty.NORMAL =
            // @ts-ignore
            ReprisedContestDifficultyDictionary[raid] ?? Difficulty.NORMAL
        const first = allActivities
            ?.get(contestDifficulty)
            ?.collection.reverse()
            .find(a => !!a.completed)
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
        const end = first.endDate
        const start = first.startDate
        const contest = isContest(raid, start)
        const weekOne = isWeekOne(raid, end)
        const dayOne = isDayOne(raid, end)

        if (!dayOne && !contest && !weekOne) {
            return null
        } else {
            return {
                raid,
                dayOne: isDayOne(raid, end),
                challenge: isChallenge,
                contest,
                weekOne,
                asterisk: contest && !isContest(raid, end), // completed after contest was over
                instanceId: first.instanceId
            } as RaceTag & { instanceId: string }
        }
    }, [allActivities, raid, report?.worldFirstPlacement])

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
        <motion.div
            initial={{
                y: 50,
                opacity: 0
            }}
            whileInView={{
                y: 0,
                opacity: 1
            }}
            viewport={{ once: true }}
            transition={{
                duration: 0.6
            }}
            className={styles["card"]}>
            <div className={styles["card-img-container"]}>
                <Image
                    priority
                    className={styles["card-background"]}
                    src={RaidCardBackground[raid]}
                    alt={strings.raidNames[raid]}
                />
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
                        filter={filter}
                        report={report}
                        activities={allActivities?.all ?? new Collection()}
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
        </motion.div>
    )
}

export default RaidCard
