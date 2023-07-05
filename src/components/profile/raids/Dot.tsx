import { MouseEvent, useCallback } from "react"
import styles from "../../../styles/profile.module.css"
import { RADIUS, SPACING, STAR_OFFSETS } from "./DotGraph"
import { DotTooltipProps } from "./DotTooltip"
import { ValidRaidHash, raidDetailsFromHash } from "../../../util/destiny/raid"

export const Red = "#F44336"
export const Green = "#4CAF50"

type DotProps = {
    idx: number
    id: string
    completed: boolean
    star: boolean
    duration: string
    startDate: Date
    cy: number
    setTooltip(data: DotTooltipProps): void
    tooltipData: DotTooltipProps
    hash: ValidRaidHash
}

const Dot = ({
    idx,
    id,
    completed,
    star,
    cy,
    setTooltip,
    tooltipData,
    duration,
    startDate,
    hash
}: DotProps) => {
    const cx = SPACING / 2 + SPACING * idx
    const handleHover = useCallback(
        ({ clientX, currentTarget }: MouseEvent) => {
            const containerToEdge =
                currentTarget.parentElement!.parentElement!.getBoundingClientRect().left
            const xOffset = clientX - containerToEdge + SPACING

            setTooltip({
                isShowing: true,
                activityCompleted: completed,
                details: raidDetailsFromHash(hash),
                startDate,
                duration,
                offset: {
                    x: xOffset,
                    y: cy
                }
            })
        },
        [setTooltip, completed, duration, hash, startDate, cy]
    )

    const handleMouseLeave = useCallback(
        (e: MouseEvent) => {
            setTooltip({
                ...tooltipData,
                isShowing: false
            })
        },
        [tooltipData, setTooltip]
    )

    return (
        <a
            href={`/pgcr/${id}`}
            className={[styles["dot"], styles["dot-hover"]].join(" ")}
            onMouseOver={handleHover}
            onMouseOut={handleMouseLeave}>
            <circle
                fill={completed ? Green : Red}
                fillOpacity={0.978}
                r={RADIUS}
                cx={cx}
                cy={cy}></circle>
            {star && <Star x={cx} y={cy} />}
        </a>
    )
}

type StarProps = { x: number; y: number }
const Star = ({ x, y }: StarProps) => {
    const points = STAR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy] as const)
    return (
        <polygon
            className={styles["star"]}
            fill="white"
            points={points.map(coords => coords.join(",")).join(" ")}
        />
    )
}

export default Dot
