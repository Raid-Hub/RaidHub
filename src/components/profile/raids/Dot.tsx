import styles from "~/styles/pages/profile/raids.module.css"
import { MouseEvent, useCallback, useEffect, useRef } from "react"
import { RADIUS, SKULL_FACTOR, SPACING, STAR_OFFSETS } from "./DotGraph"
import { DotTooltipProps } from "./DotTooltip"
import { ElevatedRaidDifficulties } from "~/types/raids"
import { Tag } from "~/util/raidhub/tags"
import Activity from "~/models/profile/data/Activity"
import { animate } from "framer-motion"
import RaidSkull from "~/images/icons/destiny2/RaidSkull"
import { includedIn } from "~/util/betterIncludes"
import { useRouter } from "next/router"

export const Red = "#F44336"
export const Green = "#4CAF50"
export const Teal = "#36c9bd"

type DotProps = {
    activity: Activity
    centerX: number
    centerY: number
    isTargeted: boolean
    tooltipData: DotTooltipProps | null
    setTooltip(data: DotTooltipProps | null): void
}

const Dot = ({ centerX, activity, centerY, isTargeted, setTooltip, tooltipData }: DotProps) => {
    const ref = useRef<HTMLAnchorElement | null>(null)
    const handleHover = useCallback(
        ({ clientX, currentTarget }: MouseEvent) => {
            // if anything breaks with the tooltip, check this first
            const containerToEdge =
                currentTarget.parentElement!.parentElement!.getBoundingClientRect().left
            const xOffset = clientX - containerToEdge + SPACING

            setTooltip({
                isShowing: true,
                activity,
                flawless: activity.flawless,
                lowman: activity.completed
                    ? activity.playerCount === 1
                        ? Tag.SOLO
                        : activity.playerCount === 2
                        ? Tag.DUO
                        : activity.playerCount === 3
                        ? Tag.TRIO
                        : null
                    : null,
                offset: {
                    x: xOffset,
                    y: centerY
                }
            })
        },
        [activity, centerY, setTooltip]
    )

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

            animate(ref.current, { opacity: [1, 0, 1] }, { repeat: 3, duration: 1, type: "tween" })
        }
    }, [isTargeted])

    const router = useRouter()

    return (
        <a
            href={`/pgcr/${activity.activityId}`}
            onClick={e => {
                e.preventDefault()
                router.push({
                    pathname: "/pgcr/[activityId]",
                    query: { activityId: activity.activityId }
                })
            }}
            ref={ref}
            onMouseEnter={handleHover}
            onMouseLeave={handleMouseLeave}
            className={[styles["dot"], styles["dot-hover"]].join(" ")}>
            <circle
                fill={activity.completed ? (activity.flawless ? Teal : Green) : Red}
                fillOpacity={0.978}
                r={RADIUS}
                cx={centerX}
                cy={centerY}
            />

            {activity.completed && activity.playerCount <= 3 ? (
                <Star x={centerX} y={centerY} spinning={activity.playerCount === 1} />
            ) : (
                (activity.contest || activity.dayOne) && (
                    <RaidSkull
                        color="white"
                        width={2 * SKULL_FACTOR * RADIUS}
                        height={2 * SKULL_FACTOR * RADIUS}
                        x={centerX - SKULL_FACTOR * RADIUS}
                        y={centerY - SKULL_FACTOR * RADIUS}
                    />
                )
            )}
            {includedIn(ElevatedRaidDifficulties, activity.difficulty) && (
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
