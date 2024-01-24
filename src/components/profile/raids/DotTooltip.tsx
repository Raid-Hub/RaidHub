import styles from "../../../styles/pages/profile/raids.module.css"
import { useMemo } from "react"
import { getRelativeTime } from "../../../util/presentation/pastDates"
import { FULL_HEIGHT } from "./DotGraph"
import { useLocale } from "../../app/LocaleManager"
import { Green, Orange, Red, Teal } from "./Dot"
import { raidVersion } from "../../../util/destiny/raidUtils"
import { Tag } from "../../../util/raidhub/tags"
import Activity from "../../../models/profile/data/Activity"
import { secondsToHMS } from "~/util/presentation/formatting"

export type DotTooltipProps = {
    offset: {
        x: number
        y: number
    }
    isShowing: boolean
    activity: Activity
}

const DotTooltip = ({ offset, isShowing, activity }: DotTooltipProps) => {
    const { strings } = useLocale()
    const dateString = useMemo(
        () => getRelativeTime(activity.dateCompleted),
        [activity.dateCompleted]
    )
    const difficultyString = useMemo(() => raidVersion(activity, strings), [activity, strings])
    const lowman = activity.completed
        ? activity.playerCount === 1
            ? Tag.SOLO
            : activity.playerCount === 2
            ? Tag.DUO
            : activity.playerCount === 3
            ? Tag.TRIO
            : null
        : null

    return (
        <div
            role="tooltip"
            className={styles["dot-tooltip"]}
            style={{
                top: `${(offset.y / FULL_HEIGHT) * 100}%`,
                left: `${offset.x}px`,
                opacity: isShowing ? 1 : 0,
                borderColor: activity.player.finishedRaid
                    ? activity.flawless
                        ? Teal
                        : Green
                    : activity.completed
                    ? Orange
                    : Red
            }}>
            <div>{secondsToHMS(activity.durationSeconds)}</div>
            <div className={styles["dot-tooltip-date"]}>{dateString}</div>
            <hr />
            <div className={styles["dot-tooltip-tags"]}>
                <span>{lowman && strings.tags[lowman]}</span>
                <span>{activity.flawless && strings.tags[Tag.FLAWLESS]}</span>
                <span>{difficultyString}</span>
            </div>
        </div>
    )
}

export default DotTooltip
