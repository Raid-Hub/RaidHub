import styles from "../../../styles/pages/profile/raids.module.css"
import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { RADIUS, SKULL_FACTOR, SPACING, STAR_OFFSETS } from "./DotGraph"
import { DotTooltipProps } from "./DotTooltip"
import { Difficulty } from "../../../types/raids"
import { isContest, isDayOne, raidTupleFromHash } from "../../../util/destiny/raid"
import { Tag } from "../../../util/raidhub/tags"
import Activity from "../../../models/profile/data/Activity"
import { animate } from "framer-motion"

export const Red = "#F44336"
export const Green = "#4CAF50"
export const Teal = "#36c9bd"

type DotProps = {
    index: number
    activity: Activity
    flawless: boolean
    playerCount: number
    centerY: number
    isTargeted: boolean
    tooltipData: DotTooltipProps | null
    setTooltip(data: DotTooltipProps | null): void
}

const Dot = ({
                 index,
                 activity,
                 flawless,
                 playerCount,
                 centerY,
                 isTargeted,
                 setTooltip,
                 tooltipData
             }: DotProps) => {
    const ref = useRef<HTMLAnchorElement | null>(null)

    const details = useMemo(() => raidTupleFromHash(activity.hash), [activity])

    const [animationIsRunning, setAnimationIsRunning] =useState(false)
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

    useEffect(() => {
        if (isTargeted && ref.current) {
            ref.current.scrollIntoView({
                block: "nearest",
                inline: "center",
                behavior: "smooth"
            })

            if (!animationIsRunning){
                console.log(ref.current)
                console.log(isTargeted)
                const animation = animate(
                    ref.current,
                    { opacity: [1, 0, 1] },
                    { repeat: 3, duration: 1, type: "tween" }
                )
                setAnimationIsRunning(true)
                setTimeout(()=>{
                    setAnimationIsRunning(false)
                }, animation.duration * 3 * 1000)
            }
        }
    }, [isTargeted])

    const centerX = SPACING / 2 + SPACING * index
    return (
        <a
            ref={ref}
            href={`/pgcr/${activity.instanceId}`}
            className={[styles["dot"], styles["dot-hover"]].join(" ")}
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
                (isContest(details[0], activity.startDate) ||
                    isDayOne(details[0], activity.endDate)) && (
                    <image
                        width={2 * SKULL_FACTOR * RADIUS}
                        height={2 * SKULL_FACTOR * RADIUS}
                        className={styles["contest-skull"]}
                        href={"../../../../icons/skull.png"}
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
