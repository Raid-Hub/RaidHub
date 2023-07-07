import styles from "../../../styles/pages/profile/raids.module.css"
import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { RADIUS, SPACING, STAR_OFFSETS } from "./DotGraph"
import { DotTooltipProps } from "./DotTooltip"
import { Difficulty, ValidRaidHash, raidDetailsFromHash } from "../../../util/destiny/raid"

export const Red = "#F44336"
export const Green = "#4CAF50"
export const Teal = "#36c9bd"

type DotProps = {
    index: number
    instanceId: string
    raidHash: ValidRaidHash
    completed: boolean
    flawless: boolean
    playerCount: number
    startDate: Date
    duration: string
    centerY: number
    targetted: boolean
    tooltipData: DotTooltipProps
    setTooltip(data: DotTooltipProps): void
}

const Dot = ({
    index,
    instanceId,
    completed,
    flawless,
    playerCount,
    centerY,
    setTooltip,
    tooltipData,
    duration,
    startDate,
    raidHash,
    targetted
}: DotProps) => {
    const ref = useRef<HTMLAnchorElement | null>(null)

    const handleHover = ({ clientX, currentTarget }: MouseEvent) => {
        const containerToEdge =
            currentTarget.parentElement!.parentElement!.getBoundingClientRect().left
        const xOffset = clientX - containerToEdge + SPACING

        setTooltip({
            isShowing: true,
            activityCompleted: completed,
            details: raidDetailsFromHash(raidHash),
            flawless,
            startDate,
            duration,
            offset: {
                x: xOffset,
                y: centerY
            }
        })
    }

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
        const details = raidDetailsFromHash(raidHash)
        return details.difficulty !== Difficulty.NORMAL || details.isContest(startDate)
    }, [raidHash, startDate])

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

    const centerX = SPACING / 2 + SPACING * index
    return (
        <a
            ref={ref}
            href={`/pgcr/${instanceId}`}
            className={[
                styles["dot"],
                styles["dot-hover"],
                blinking ? styles["blinking-dot"] : ""
            ].join(" ")}
            onMouseEnter={handleHover}
            onMouseLeave={handleMouseLeave}>
            <circle
                fill={completed ? (flawless ? Teal : Green) : Red}
                fillOpacity={0.978}
                r={RADIUS}
                cx={centerX}
                cy={centerY}></circle>
            {playerCount <= 3 && <Star x={centerX} y={centerY} spinning={playerCount === 1} />}
            {notNormal && (
                <circle
                    fill="none"
                    stroke="white"
                    strokeWidth={RADIUS / 10}
                    r={RADIUS * 0.95}
                    cx={centerX}
                    cy={centerY}></circle>
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
