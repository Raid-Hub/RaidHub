import styles from "../../../styles/pages/profile/raids.module.css"
import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { RADIUS, SKULL_FACTOR, SPACING, STAR_OFFSETS } from "./DotGraph"
import { DotTooltipProps } from "./DotTooltip"
import { Difficulty, ValidRaidHash } from "../../../types/raids"
import { Icons } from "../../../util/presentation/icons"
import { isContest, raidTupleFromHash } from "../../../util/destiny/raid"
import { Tag } from "../../../util/raidhub/tags"
import Activity from "../../../models/profile/Activity"

export const Red = "#F44336"
export const Green = "#4CAF50"
export const Teal = "#36c9bd"

type DotProps = {
    index: number
    activity: Activity
    flawless: boolean
    playerCount: number
    centerY: number
    targetted: boolean
    tooltipData: DotTooltipProps | null
    setTooltip(data: DotTooltipProps | null): void
}

const Dot = ({
    index,
    activity,
    flawless,
    playerCount,
    centerY,
    targetted,
    setTooltip,
    tooltipData
}: DotProps) => {
    const ref = useRef<HTMLAnchorElement | null>(null)

    const details = useMemo(() => raidTupleFromHash(activity.hash), [activity])

    const handleHover = ({ clientX, currentTarget }: MouseEvent) => {
        const containerToEdge =
            currentTarget.parentElement!.parentElement!.getBoundingClientRect().left
        const xOffset = clientX - containerToEdge + SPACING

        setTooltip({
            isShowing: true,
            activity,
            flawless,
            lowman:
                playerCount === 1
                    ? Tag.SOLO
                    : playerCount === 2
                    ? Tag.DUO
                    : playerCount === 3
                    ? Tag.TRIO
                    : null,
            offset: {
                x: xOffset,
                y: centerY
            }
        })
    }

    const handleMouseLeave = useCallback(
        ({}: MouseEvent) => {
            tooltipData &&
                setTooltip({
                    ...tooltipData,
                    isShowing: false
                })
        },
        [tooltipData, setTooltip]
    )

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
            href={`/pgcr/${activity.instanceId}`}
            className={[
                styles["dot"],
                styles["dot-hover"],
                blinking ? styles["blinking-dot"] : ""
            ].join(" ")}
            onMouseEnter={handleHover}
            onMouseLeave={handleMouseLeave}>
            {
                <circle
                    fill={activity.completed ? (flawless ? Teal : Green) : Red}
                    fillOpacity={0.978}
                    r={RADIUS}
                    cx={centerX}
                    cy={centerY}
                />
            }
            {playerCount <= 3 ? (
                <Star x={centerX} y={centerY} spinning={playerCount === 1} />
            ) : (
                isContest(details[0], activity.startDate) && (
                    <image
                        width={2 * SKULL_FACTOR * RADIUS}
                        height={2 * SKULL_FACTOR * RADIUS}
                        className={styles["contest-skull"]}
                        href={Icons.SKULL}
                        x={centerX - SKULL_FACTOR * RADIUS}
                        y={centerY - SKULL_FACTOR * RADIUS}
                    />
                )
            )}
            {details[1] === Difficulty.MASTER && (
                <circle
                    fill="none"
                    stroke="white"
                    strokeWidth={RADIUS / 10}
                    r={RADIUS * 0.95}
                    cx={centerX}
                    cy={centerY}
                />
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
