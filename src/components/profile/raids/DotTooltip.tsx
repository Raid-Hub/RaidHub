import styles from "../../../styles/pages/profile/raids.module.css"
import { useMemo } from "react"
import { RaidDifficultyTuple } from "../../../types/raids"
import { getRelativeTime } from "../../../util/presentation/pastDates"
import { FULL_HEIGHT } from "./DotGraph"
import { useLocale } from "../../app/LanguageProvider"
import { Green, Red, Teal } from "./Dot"
import { raidVersion } from "../../../util/destiny/raid"
import { Tag } from "../../../util/raidhub/tags"

export type DotTooltipProps = {
    offset: {
        x: number
        y: number
    }
    isShowing: boolean
    activityCompleted: boolean
    flawless: boolean
    lowman: Tag.SOLO | Tag.DUO | Tag.TRIO | null
    startDate: Date
    endDate: Date
    duration: string
    details: RaidDifficultyTuple
}

const DotTooltip = ({
    offset,
    isShowing,
    activityCompleted,
    flawless,
    lowman,
    startDate,
    endDate,
    duration,
    details
}: DotTooltipProps) => {
    const { strings } = useLocale()
    const dateString = useMemo(() => getRelativeTime(endDate), [endDate])
    const difficultyString = useMemo(
        () => raidVersion(details, startDate, endDate, strings),
        [details, endDate, startDate, strings]
    )

    console.log(flawless)

    return (
        <div
            role="tooltip"
            className={styles["dot-tooltip"]}
            style={{
                top: `${(offset.y / FULL_HEIGHT) * 100}%`,
                left: `${offset.x}px`,
                opacity: isShowing ? 1 : 0,
                borderColor: activityCompleted ? (flawless ? Teal : Green) : Red
            }}>
            <div>{duration}</div>
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
