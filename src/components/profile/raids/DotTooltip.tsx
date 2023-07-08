import styles from "../../../styles/pages/profile/raids.module.css"
import { useMemo } from "react"
import { RaidDifficultyTuple, raidVersion } from "../../../util/destiny/raid"
import { getRelativeTime } from "../../../util/presentation/pastDates"
import { FULL_HEIGHT } from "./DotGraph"
import { useLocale } from "../../app/LanguageProvider"
import { Green, Red, Teal } from "./Dot"

export type DotTooltipProps = {
    offset: {
        x: number
        y: number
    }
    isShowing: boolean
    activityCompleted: boolean
    flawless: boolean
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
            {/* <div>{strings.raidNames[raid]}</div> */}
            <div>{difficultyString}</div>
        </div>
    )
}

export default DotTooltip
