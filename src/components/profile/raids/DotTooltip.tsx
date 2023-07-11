import styles from "../../../styles/pages/profile/raids.module.css"
import { useMemo } from "react"
import { getRelativeTime } from "../../../util/presentation/pastDates"
import { FULL_HEIGHT } from "./DotGraph"
import { useLocale } from "../../app/LanguageProvider"
import { Green, Red, Teal } from "./Dot"
import { raidVersion } from "../../../util/destiny/raid"
import { Tag } from "../../../util/raidhub/tags"
import Activity from "../../../models/profile/Activity"

export type DotTooltipProps = {
    offset: {
        x: number
        y: number
    }
    isShowing: boolean
    activity: Activity
    flawless: boolean
    lowman: Tag.SOLO | Tag.DUO | Tag.TRIO | null
}

const DotTooltip = ({ offset, isShowing, activity, flawless, lowman }: DotTooltipProps) => {
    const { strings } = useLocale()
    const dateString = useMemo(() => getRelativeTime(activity.endDate), [activity.endDate])
    const difficultyString = useMemo(
        () =>
            raidVersion(
                [activity.raid, activity.difficulty],
                activity.startDate,
                activity.endDate,
                strings
            ),
        [activity, strings]
    )

    return (
        <div
            role="tooltip"
            className={styles["dot-tooltip"]}
            style={{
                top: `${(offset.y / FULL_HEIGHT) * 100}%`,
                left: `${offset.x}px`,
                opacity: isShowing ? 1 : 0,
                borderColor: activity.completed ? (flawless ? Teal : Green) : Red
            }}>
            <div>{activity.values.activityDurationSeconds.basic.displayValue}</div>
            <div className={styles["dot-tooltip-date"]}>{dateString}</div>
            <hr />
            <div className={styles["dot-tooltip-tags"]}>
                <span>{lowman && strings.tags[lowman]}</span>
                <span>{flawless && strings.tags[Tag.FLAWLESS]}</span>
                <span>{difficultyString}</span>
            </div>
        </div>
    )
}

export default DotTooltip
