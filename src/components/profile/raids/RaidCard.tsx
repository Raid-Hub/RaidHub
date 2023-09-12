import styles from "~/styles/pages/profile/raids.module.css"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Collection } from "@discordjs/collection"
import { ListedRaid } from "~/types/raids"
import RaidStatsCollection from "~/models/profile/data/RaidStatsCollection"
import ActivityCollection, { applyFilter } from "~/models/profile/data/ActivityCollection"
import RaidCardBackground from "~/images/raid-backgrounds"
import { ExtendedActivity, RaceTag } from "~/types/profile"
import { useLocale } from "~/components/app/LocaleManager"
import DotGraphWrapper from "./DotGraph"
import BigNumberStatItem from "./BigNumberStatItem"
import { FilterCallback } from "~/types/generic"
import Activity from "~/models/profile/data/Activity"

type RaidModalProps = {
    raid: ListedRaid
    stats: RaidStatsCollection | undefined
    isLoadingStats: boolean
    activities: ActivityCollection | null
    isLoadingActivities: boolean
    filter: FilterCallback<ExtendedActivity>
}

export default function RaidCard({
    raid,
    stats,
    isLoadingStats,
    activities,
    isLoadingActivities,
    filter
}: RaidModalProps) {
    const [hoveredTag, setHoveredTag] = useState<string | null>(null)

    const activitesFiltered = useMemo(
        () => applyFilter(activities?.all ?? new Collection<string, Activity>(), filter, {}),
        [activities, filter]
    )

    const averageClear = useMemo(() => {
        return undefined
    }, [])

    const contestFirstClear: (RaceTag & { instanceId?: string }) | null = useMemo(() => {
        return null
        // const contestDifficulty:
        //     | (typeof ReprisedContestRaidDifficulties)[number]
        //     | Difficulty.NORMAL =
        //     // @ts-ignore
        //     ReprisedContestDifficultyDictionary[raid] ?? Difficulty.NORMAL
        // const first = allActivities
        //     ?.get(contestDifficulty)
        //     ?.collection.reverse()
        //     .find(a => !!a.completed)
        // const isChallenge = contestDifficulty !== Difficulty.NORMAL
        // if (!first) {
        //     return report?.worldFirstPlacement
        //         ? {
        //               raid,
        //               challenge: isChallenge,
        //               dayOne: false,
        //               contest: false,
        //               weekOne: false
        //           }
        //         : null
        // }
        // const end = first.endDate
        // const start = first.startDate
        // const contest = isContest(raid, start)
        // const weekOne = isWeekOne(raid, end)
        // const dayOne = isDayOne(raid, end)

        // if (!dayOne && !contest && !weekOne) {
        //     return null
        // } else {
        //     return {
        //         raid,
        //         dayOne: isDayOne(raid, end),
        //         challenge: isChallenge,
        //         contest,
        //         weekOne,
        //         asterisk: contest && !isContest(raid, end), // completed after contest was over
        //         instanceId: first.instanceId
        //     } as RaceTag & { instanceId: string }
        // }
    }, [])

    useEffect(() => {
        if (hoveredTag) {
            // Set a new timeout
            const timer = setTimeout(() => {
                setHoveredTag(null)
            }, 2500)

            return () => {
                clearTimeout(timer)
            }
        }
    }, [hoveredTag])

    const { strings } = useLocale()

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
                    className={styles["card-background"]}
                    priority
                    width={960}
                    height={540}
                    src={RaidCardBackground[raid]}
                    alt={strings.raidNames[raid]}
                />
                <div className={styles["tag-row"]}>
                    {/* {contestFirstClear && (
                        <RaceTagLabel
                            {...contestFirstClear}
                            placement={report?.worldFirstPlacement ?? undefined}
                            setActiveId={setHoveredTag}
                        />
                    )} */}
                </div>
                <div className={styles["img-overlay-bottom"]}>
                    <div className={styles["card-challenge-tags"]}>
                        {/* {report?.tags()?.map((tag, key) => (
                            <RaidTagLabel {...tag} key={key} setActiveId={setHoveredTag} />
                        ))} */}
                    </div>
                    <span className={styles["card-title"]}>{strings.raidNames[raid]}</span>
                </div>
            </div>
            <div className={styles["card-content"]}>
                <div className={styles["graph-content"]}>
                    <DotGraphWrapper
                        isLoading={isLoadingActivities}
                        activities={activitesFiltered}
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
                    {/* <BigNumberStatItem
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
                    /> */}

                    {/* <BigNumberStatItem
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
                    /> */}

                    {/* <BigNumberStatItem
                        displayValue={report?.sherpaCount ? report.sherpaCount : 0}
                        isLoading={isLoadingReport}
                        name={strings.sherpas}
                    /> */}
                </div>
            </div>
        </motion.div>
    )
}
