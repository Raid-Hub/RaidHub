"use client"

import { Collection } from "@discordjs/collection"
import { m } from "framer-motion"
import { useCallback, useMemo, useState } from "react"
import { useRaidCardContext } from "~/app/(profile)/raids/RaidCardContext"
import { useTags } from "~/app/(profile)/raids/useTags"
import { useRaidHubManifest } from "~/app/layout/managers/RaidHubManifestManager"
import { CloudflareImage } from "~/components/CloudflareImage"
import { Loading } from "~/components/Loading"
import Expand from "~/components/icons/Expand"
import { RaidSplash } from "~/data/activity-images"
import { useTimeout } from "~/hooks/util/useTimeout"
import type {
    RaidHubPlayerActivitiesActivity,
    RaidHubPlayerProfileLeaderboardEntry
} from "~/services/raidhub/types"
import { includedIn } from "~/util/helpers"
import { medianElement } from "~/util/math"
import { secondsToHMS } from "~/util/presentation/formatting"
import BigNumberStatItem from "./BigNumberStatItem"
import DotGraphWrapper, { FULL_HEIGHT } from "./DotGraph"
import RaceTagLabel from "./RaceTagLabel"
import RaidTagLabel from "./RaidTagLabel"
import ExpandedRaidView from "./expanded/ExpandedRaidView"
import styles from "./raids.module.css"

type RaidModalProps = {
    leaderboardData: RaidHubPlayerProfileLeaderboardEntry[] | null
} & (
    | {
          canExpand: true
          expand: () => void
          closeExpand: () => void
          isExpanded: boolean
      }
    | {
          canExpand: false
      }
)

/** @deprecated */
export default function RaidCard({ leaderboardData, ...props }: RaidModalProps) {
    const { activities, isLoadingActivities, raid } = useRaidCardContext()
    const { getRaidString, getVersionString, leaderboards, listedRaids, pantheonId } =
        useRaidHubManifest()
    const wfBoardId = (
        leaderboards.worldFirst[raid]?.find(b => b.category === "challenge") ??
        leaderboards.worldFirst[raid]?.find(b => b.category === "normal")
    )?.id

    const [hoveredTag, setHoveredTag] = useState<string | null>(null)

    useTimeout(
        useCallback(() => setHoveredTag(null), []),
        2500,
        [hoveredTag]
    )

    const recentClear = useMemo(
        () => activities?.find(a => a.player.completed && a.fresh) ?? null,
        [activities]
    )

    const tags = useTags(activities ?? new Collection())

    const firstContestClear: RaidHubPlayerProfileLeaderboardEntry | undefined = useMemo(() => {
        if (!wfBoardId) return undefined
        const wfBoardClear = leaderboardData
            ?.filter(e => e.boardId === wfBoardId)
            ?.sort((a, b) => a.rank - b.rank)[0]
        if (wfBoardClear) return wfBoardClear

        const allLeaderboardClears = leaderboardData
            ?.flat()
            .sort(
                (a, b) => new Date(a.dateCompleted).getTime() - new Date(b.dateCompleted).getTime()
            )
        return allLeaderboardClears?.[0]
    }, [leaderboardData, wfBoardId])

    const { fastestFullClear, averageClear } = useMemo(() => {
        const freshFulls = activities?.filter(a => a.completed && a.fresh)
        const fastestFullClear = freshFulls?.size
            ? freshFulls.reduce<RaidHubPlayerActivitiesActivity>((curr, nxt) =>
                  nxt.duration < curr.duration ? nxt : curr
              )
            : undefined

        const averageClear = freshFulls
            ? medianElement(freshFulls.toSorted((a, b) => a.duration - b.duration))
            : undefined

        return { fastestFullClear, averageClear }
    }, [activities])

    return (
        <>
            {props.canExpand && props.isExpanded && includedIn(listedRaids, raid) && (
                <ExpandedRaidView raid={raid} dismiss={props.closeExpand} />
            )}
            <m.div
                initial={{
                    y: 20,
                    opacity: 0
                }}
                whileInView={{
                    y: 0,
                    opacity: 1
                }}
                viewport={{ once: true }}
                transition={{
                    duration: 0.3
                }}
                className={styles.card}>
                <div className={styles["card-img-container"]}>
                    <CloudflareImage
                        className={styles["card-background"]}
                        priority
                        width={960}
                        height={540}
                        cloudflareId={
                            includedIn(listedRaids, raid) ? RaidSplash[raid] : "pantheonSplash"
                        }
                        alt={
                            includedIn(listedRaids, raid)
                                ? getRaidString(raid)
                                : getVersionString(raid)
                        }
                    />
                    <div className={styles["card-top"]}>
                        {includedIn(listedRaids, raid) && firstContestClear && (
                            <RaceTagLabel
                                placement={firstContestClear.rank}
                                instanceId={firstContestClear.instanceId}
                                dayOne={firstContestClear.dayOne}
                                contest={firstContestClear.contest}
                                weekOne={firstContestClear.weekOne}
                                challenge={firstContestClear.type === "Challenge"}
                                raid={raid}
                                setActiveId={setHoveredTag}
                            />
                        )}
                        {props.canExpand && (
                            <div
                                className={[
                                    styles["card-top-right"],
                                    styles["visible-on-card-hover"]
                                ].join(" ")}>
                                <Expand color="white" sx={25} onClick={props.expand} />
                            </div>
                        )}
                    </div>
                    <div className={styles["img-overlay-bottom"]}>
                        <div className={styles["card-challenge-tags"]}>
                            {tags?.map(tag => (
                                <RaidTagLabel
                                    completed={tag.activity.completed}
                                    key={tag.activity.instanceId}
                                    raid={includedIn(listedRaids, raid) ? raid : pantheonId}
                                    setActiveId={setHoveredTag}
                                    instanceId={tag.activity.instanceId}
                                    isBestPossible={tag.bestPossible}
                                    playerCount={tag.activity.playerCount}
                                    fresh={tag.activity.fresh}
                                    flawless={tag.activity.flawless}
                                    difficulty={tag.activity.meta.versionId}
                                    contest={tag.activity.contest}
                                />
                            ))}
                        </div>
                        <span className={styles["card-title"]}>
                            {includedIn(listedRaids, raid)
                                ? getRaidString(raid)
                                : getVersionString(raid)}
                        </span>
                    </div>
                </div>
                <div className={styles["card-content"]}>
                    <div className={styles["graph-content"]}>
                        {isLoadingActivities ? (
                            <div
                                className={styles["dots-container"]}
                                style={{ height: FULL_HEIGHT }}>
                                <Loading $alpha={0.75} />
                            </div>
                        ) : (
                            <DotGraphWrapper activities={activities} targetDot={hoveredTag} />
                        )}
                        <div className={styles["graph-right"]}>
                            <BigNumberStatItem
                                displayValue={activities?.filter(a => a.player.completed).size ?? 0}
                                isLoading={isLoadingActivities}
                                name={"Total\nClears"}
                                extraLarge={true}
                            />
                        </div>
                    </div>

                    <div className={styles.timings}>
                        <BigNumberStatItem
                            displayValue={
                                recentClear ? secondsToHMS(recentClear.duration, false) : "N/A"
                            }
                            isLoading={isLoadingActivities}
                            name="Recent"
                            href={recentClear ? `/pgcr/${recentClear.instanceId}` : undefined}
                        />
                        <BigNumberStatItem
                            displayValue={
                                fastestFullClear
                                    ? secondsToHMS(fastestFullClear.duration, false)
                                    : "N/A"
                            }
                            isLoading={isLoadingActivities}
                            name="Fastest"
                            href={
                                fastestFullClear
                                    ? `/pgcr/${fastestFullClear.instanceId}`
                                    : undefined
                            }
                        />
                        <BigNumberStatItem
                            displayValue={
                                averageClear ? secondsToHMS(averageClear.duration, false) : "N/A"
                            }
                            isLoading={isLoadingActivities}
                            name="Average"
                            href={averageClear ? `/pgcr/${averageClear.instanceId}` : undefined}
                        />
                    </div>
                </div>
            </m.div>
        </>
    )
}
