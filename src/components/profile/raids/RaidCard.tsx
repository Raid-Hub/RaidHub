import styles from "~/styles/pages/profile/raids.module.css"
import { useEffect, useMemo, useState } from "react"
import { m } from "framer-motion"
import { Collection } from "@discordjs/collection"
import { ListedRaid } from "~/types/raids"
import RaidCardBackground from "~/images/raid-backgrounds"
import { useLocale } from "~/components/app/LocaleManager"
import DotGraphWrapper, { FULL_HEIGHT } from "./DotGraph"
import BigNumberStatItem from "./BigNumberStatItem"
import Activity from "~/models/profile/data/Activity"
import Loading from "~/components/global/Loading"
import RaidStats from "~/models/profile/data/RaidStats"
import CloudflareImage from "~/images/CloudflareImage"
import { secondsToHMS } from "~/util/presentation/formatting"
import RaidTagLabel from "./RaidTagLabel"
import RaceTagLabel from "./RaceTagLabel"
import Expand from "~/images/icons/Expand"
import { findTags } from "~/util/raidhub/tags"
import { RaidHubPlayerResponse } from "~/types/raidhub-api"
import { medianElement } from "~/util/math"
import ExpandedRaidView from "./expanded/ExpandedRaidView"

type RaidModalProps = {
    raid: ListedRaid
    expand: () => void
    clearExpand: () => void
    leaderboardData: (RaidHubPlayerResponse["activityLeaderboardEntries"][string][number] & {
        key: string
    })[]
    wfBoard: string | null
    isExpanded: boolean
} & (
    | {
          stats: RaidStats
          isLoadingStats: false
      }
    | {
          stats: null
          isLoadingStats: true
      }
) &
    (
        | {
              isLoadingActivities: false
              activities: Collection<string, Activity>
          }
        | { isLoadingActivities: true; activities: null }
    )

export default function RaidCard({
    raid,
    expand,
    clearExpand,
    leaderboardData,
    wfBoard,
    stats,
    isLoadingStats,
    activities,
    isLoadingActivities,
    isExpanded
}: RaidModalProps) {
    const [hoveredTag, setHoveredTag] = useState<string | null>(null)

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

    const recentClear = useMemo(
        () => activities?.find(a => a.didMemberComplete && a.fresh),
        [activities]
    )

    const tags = useMemo(() => findTags(Array.from(activities?.values() ?? [])), [activities])

    const { strings } = useLocale()

    const sortedLeaderboardData = leaderboardData?.sort((a, b) => a.rank - b.rank)
    const firstClear = sortedLeaderboardData.find(r => r.key == wfBoard) || sortedLeaderboardData[0]

    const { fastestFullClear, averageClear } = useMemo(() => {
        const freshFulls = activities?.filter(a => a.completed && a.fresh)
        const fastestFullClear = freshFulls?.size
            ? freshFulls.reduce<Activity>((curr, nxt) =>
                  nxt.durationSeconds < curr.durationSeconds ? nxt : curr
              )
            : undefined
        const averageClear = freshFulls
            ? medianElement(freshFulls.sorted((a, b) => a.durationSeconds - b.durationSeconds))
            : undefined

        return { fastestFullClear, averageClear }
    }, [activities])

    return isExpanded ? (
        <ExpandedRaidView
            raid={raid}
            dismiss={clearExpand}
            {...(isLoadingStats
                ? { stats: undefined, isLoadingStats: true }
                : {
                      stats: stats,
                      isLoadingStats: false
                  })}
            {...(isLoadingActivities
                ? { activities: undefined, isLoadingActivities: true }
                : {
                      activities: activities,
                      isLoadingActivities: false
                  })}
        />
    ) : (
        <m.div
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
                <CloudflareImage
                    className={styles["card-background"]}
                    priority
                    width={960}
                    height={540}
                    cloudflareId={RaidCardBackground[raid]}
                    alt={strings.raidNames[raid]}
                />
                <div className={styles["card-top"]}>
                    {firstClear && (
                        <RaceTagLabel
                            placement={firstClear.rank}
                            instanceId={firstClear.instanceId}
                            dayOne={firstClear.dayOne}
                            contest={firstClear.contest}
                            weekOne={firstClear.weekOne}
                            challenge={firstClear.key === "challenge"}
                            raid={raid}
                            setActiveId={setHoveredTag}
                        />
                    )}
                    <div
                        className={[styles["card-top-right"], styles["visible-on-card-hover"]].join(
                            " "
                        )}>
                        <Expand color="white" sx={25} onClick={expand} />
                    </div>
                </div>
                <div className={styles["img-overlay-bottom"]}>
                    <div className={styles["card-challenge-tags"]}>
                        {tags?.map((tag, key) => (
                            <RaidTagLabel
                                {...tag}
                                raid={raid}
                                key={key}
                                setActiveId={setHoveredTag}
                            />
                        ))}
                    </div>
                    <span className={styles["card-title"]}>{strings.raidNames[raid]}</span>
                </div>
            </div>
            <div className={styles["card-content"]}>
                <div className={styles["graph-content"]}>
                    {isLoadingActivities ? (
                        <div className={styles["dots-container"]} style={{ height: FULL_HEIGHT }}>
                            <Loading className={styles["dots-svg-loading"]} />
                        </div>
                    ) : (
                        <DotGraphWrapper activities={activities} targetDot={hoveredTag} />
                    )}
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
                            recentClear ? secondsToHMS(recentClear.durationSeconds) : strings.na
                        }
                        isLoading={isLoadingActivities}
                        name="Recent"
                        href={recentClear ? `/pgcr/${recentClear.activityId}` : undefined}
                    />
                    <BigNumberStatItem
                        displayValue={
                            fastestFullClear
                                ? secondsToHMS(fastestFullClear.durationSeconds)
                                : strings.na
                        }
                        isLoading={isLoadingActivities}
                        name={strings.fastestClear}
                        href={fastestFullClear ? `/pgcr/${fastestFullClear.activityId}` : undefined}
                    />
                    <BigNumberStatItem
                        displayValue={
                            averageClear ? secondsToHMS(averageClear.durationSeconds) : strings.na
                        }
                        isLoading={isLoadingActivities}
                        name={strings.averageClear}
                        href={averageClear ? `/pgcr/${averageClear.activityId}` : undefined}
                    />
                </div>
            </div>
        </m.div>
    )
}
