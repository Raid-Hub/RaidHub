import styles from "~/styles/pages/profile/raids.module.css"
import { useMemo, useState } from "react"
import { Collection } from "@discordjs/collection"
import { median } from "~/util/math"
import Activity from "~/models/profile/data/Activity"
import DotTooltip, { DotTooltipProps } from "./DotTooltip"
import Dot from "./Dot"
import { useFilterContext } from "../Profile"

// constants used to manage the height of the graph
const CANVAS_HEIGHT = 60
export const BORDER = 7
export const SPACING = 20
export const RADIUS = 6.5
// calculated constants
const MIN_Y = BORDER + 2 * RADIUS
const LINE_Y = 0.6 * CANVAS_HEIGHT + BORDER
const MAX_Y = BORDER + CANVAS_HEIGHT - 2 * RADIUS
export const FULL_HEIGHT = CANVAS_HEIGHT + 2 * BORDER

// STAR
const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180)
// legs
const dxLeg = RADIUS * Math.sin(degreesToRadians(36)) // x
const dyLeg = RADIUS * Math.cos(degreesToRadians(36)) // y
// arms
const dxArm = RADIUS * Math.cos(degreesToRadians(18)) // x
const dyArm = RADIUS * Math.sin(degreesToRadians(18)) // y
export const STAR_OFFSETS = [
    [0, -RADIUS], // top
    [-dxLeg, dyLeg], // left leg
    [dxArm, -dyArm], // right arm
    [-dxArm, -dyArm], // left arm
    [dxLeg, dyLeg] // right leg
] as const

// SKULL
export const SKULL_FACTOR = 1.15

type DotGraphWrapperProps = {
    activities: Collection<string, Activity>
    targetDot: string | null
}

export default function DotGraphWrapper({
    activities: unfilteredActivities,
    targetDot
}: DotGraphWrapperProps) {
    const filter = useFilterContext()
    const activities = useMemo(
        () => unfilteredActivities.filter(filter).reverse(),
        [unfilteredActivities, filter]
    )
    const getHeight = useMemo(() => {
        let { min, max } = activities.reduce(
            (soFar, a) => {
                const cvTime = a.durationSeconds
                return {
                    min: Math.min(soFar.min, cvTime),
                    max: Math.max(soFar.max, cvTime)
                }
            },
            {
                min: Number.MAX_SAFE_INTEGER,
                max: 0
            }
        )

        if (activities.size === 1) {
            min -= 1
            max += 1
        }

        const orderedByDuration = activities.map(a => a.durationSeconds).sort((a, b) => a - b) ?? []
        const avg = median(orderedByDuration)
        return findCurve([min, MIN_Y], [avg, LINE_Y], [max, MAX_Y])
    }, [activities])

    return <DotGraph getHeight={getHeight} dots={activities} targetDot={targetDot} />
}

type DotGraphProps = {
    getHeight: (duration: number) => number
    dots: Collection<string, Activity>
    targetDot: string | null
}

function DotGraph({ dots, getHeight, targetDot }: DotGraphProps) {
    const [dotTooltipData, setDotTooltipData] = useState<DotTooltipProps | null>(null)
    return (
        <div className={styles["dots-container"]} style={{ height: FULL_HEIGHT }}>
            {dotTooltipData && <DotTooltip {...dotTooltipData} />}
            <svg
                style={{
                    width: SPACING * (dots?.size ?? 200) + "px",
                    height: FULL_HEIGHT,
                    minWidth: "100%"
                }}>
                <line
                    x1="0%"
                    y1={LINE_Y}
                    x2="100%"
                    y2={LINE_Y}
                    style={{ stroke: "rgb(92, 92, 92)", strokeWidth: "2" }}
                />
                {dots?.toJSON().map((a, idx) => (
                    <Dot
                        key={idx}
                        index={idx}
                        activity={a}
                        flawless={false}
                        playerCount={6}
                        // TODO
                        // flawless={extended.flawless ?? false}
                        // playerCount={extended.playerCount}
                        centerY={getHeight(a.durationSeconds)}
                        setTooltip={setDotTooltipData}
                        tooltipData={dotTooltipData}
                        isTargeted={targetDot === a.instanceId}
                    />
                ))}
            </svg>
        </div>
    )
}

type Point = [number, number]

// Returns a function to determine the Y coordinate of a dot based on the slowest, fastest, and avg runs
function findCurve(min: Point, avg: Point, max: Point): (duration: number) => number {
    const [s1, y1] = min
    const [s2, y2] = avg
    const [s3, y3] = max

    const lower = (speed: number): number => {
        const slope = (y2 - y1) / (s2 - s1 || 1)
        const b = y1 - slope * s1
        return slope * speed + b
    }

    const upper = (speed: number): number => {
        const slope = (y3 - y2) / (s3 - s2 || 1)
        const b = y2 - slope * s2
        return slope * speed + b
    }

    // Return the function to determine the Y coordinate depending on if the speed is above or below the median
    return (duration: number) => {
        return duration <= s2 ? lower(duration) : upper(duration)
    }
}
