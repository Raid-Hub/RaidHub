import styles from "../../../styles/pages/profile/raids.module.css"
import { useMemo } from "react"
import { Difficulty } from "../../../util/destiny/raid"
import { getRelativeTime } from "../../../util/presentation/pastDates"
import { FULL_HEIGHT } from "./DotGraph"
import { useLocale } from "../../app/LanguageProvider"
import { Green, Red, Teal } from "./Dot"
import RaidInfo from "../../../models/pgcr/RaidInfo"

export type DotTooltipProps = {
    offset: {
        x: number
        y: number
    }
    isShowing: boolean
    activityCompleted: boolean
    flawless: boolean
    startDate: Date
    duration: string
    details: RaidInfo
}

const DotTooltip = ({
    offset,
    isShowing,
    activityCompleted,
    flawless,
    startDate,
    duration,
    details
}: DotTooltipProps) => {
    const { strings } = useLocale()
    const dateString = useMemo(() => getRelativeTime(startDate), [startDate])

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
            <div>
                {
                    strings.difficulty[
                        details.difficulty === Difficulty.NORMAL && details.isContest(startDate)
                            ? Difficulty.CONTEST
                            : details.difficulty
                    ]
                }
            </div>
        </div>
    )
}

export default DotTooltip
