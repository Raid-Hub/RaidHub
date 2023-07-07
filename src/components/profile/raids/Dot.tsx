import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import styles from "../../../styles/profile.module.css"
import { RADIUS, SPACING, STAR_OFFSETS } from "./DotGraph"
import { DotTooltipProps } from "./DotTooltip"
import { Difficulty, ValidRaidHash, raidDetailsFromHash } from "../../../util/destiny/raid"

export const Red = "#F44336"
export const Green = "#4CAF50"

type DotProps = {
    id: string
    completed: boolean
    flawless: boolean
    lowman: boolean
    duration: string
    startDate: Date
    hash: ValidRaidHash
    idx: number
    cy: number
    setTooltip(data: DotTooltipProps): void
    tooltipData: DotTooltipProps
    targetted: boolean
}

const Dot = ({
    idx,
    id,
    completed,
    flawless,
    lowman,
    cy,
    setTooltip,
    tooltipData,
    duration,
    startDate,
    hash,
    targetted
}: DotProps) => {
    const ref = useRef<HTMLAnchorElement | null>(null)
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
        ({}: MouseEvent) => {
            setTooltip({
                ...tooltipData,
                isShowing: false
            })
        },
        [tooltipData, setTooltip]
    )

    const notNormal = useMemo(() => {
        const details = raidDetailsFromHash(hash)
        return details.difficulty !== Difficulty.NORMAL || details.isContest(startDate)
    }, [hash, startDate])

    const [blinking, setBlinking] = useState<boolean>(false)
    useEffect(() => {
        if (targetted && ref.current) {
            ref.current.scrollIntoView({
                block: "nearest",
                inline: "center",
                behavior: "smooth"
            })

            // wait until the scroll "finishes" (estimation)
            const timer = setTimeout(() => {
                setBlinking(true)
            }, Math.abs(window.innerWidth / 2 - ref.current.getBoundingClientRect().left) ** 0.9 + 150)

            return () => {
                clearTimeout(timer)
            }
        } else {
            setBlinking(false)
        }
    }, [targetted])

    return (
        <a
            ref={ref}
            href={`/pgcr/${id}`}
            className={[
                styles["dot"],
                styles["dot-hover"],
                blinking ? styles["blinking-dot"] : ""
            ].join(" ")}
            onMouseEnter={handleHover}
            onMouseLeave={handleMouseLeave}>
            <circle
                fill={completed ? Green : Red}
                fillOpacity={0.978}
                r={RADIUS}
                cx={cx}
                cy={cy}></circle>
            {(lowman || flawless) && <Star x={cx} y={cy} spinning={lowman && flawless} />}
            {notNormal && (
                <circle
                    fill="none"
                    stroke="white"
                    strokeWidth={RADIUS / 4}
                    strokeOpacity={0.6}
                    r={RADIUS}
                    cx={cx}
                    cy={cy}></circle>
            )}
        </a>
    )
}

type StarProps = { x: number; y: number; spinning: boolean }
const Star = ({ x, y, spinning }: StarProps) => {
    const points = STAR_OFFSETS.map(([dx, dy]) => [x + dx, y + dy] as const)
    return (
        <polygon fill="white" points={points.map(coords => coords.join(",")).join(" ")}>
            {spinning && (
                <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from={`0 ${x} ${y}`}
                    to={`360 ${x} ${y}`}
                    dur="4s"
                    repeatCount="indefinite"
                />
            )}
        </polygon>
    )
}

export default Dot
