import { DestinyHistoricalStatsPeriodGroup } from "bungie-net-core/lib/models"
import styles from "../../../styles/profile.module.css"
import { median } from "../../../util/math"
import Dot from "./Dot"
import Loading from "../../global/Loading"
import DotTooltip, { DotTooltipProps } from "./DotTooltip"
import { useState } from "react"
import { ValidRaidHash } from "../../../util/destiny/raid"
import RaidInfo from "../../../models/pgcr/RaidInfo"

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

type DotGraphWrapperProps = {
    dots: DestinyHistoricalStatsPeriodGroup[]
    isLoading: boolean
}

type Statistics = { min: number; max: number; total: number }
const baseStats: Statistics = {
    min: Number.MAX_SAFE_INTEGER,
    max: 0,
    total: 0
}

const DotGraphWrapper = ({ dots, isLoading }: DotGraphWrapperProps) => {
    let { min, max, total } = dots.reduce((ac, cv) => {
        const cvTime = cv.values.activityDurationSeconds.basic.value
        return {
            min: Math.min(ac.min, cvTime),
            max: Math.max(ac.max, cvTime),
            total: ac.total + cvTime
        }
    }, baseStats)
    if (dots.length === 1) {
        min -= 1
        max += 1
    }

    const orderedByDuration = dots
        .map(({ values }) => values.activityDurationSeconds.basic.value)
        .sort((a, b) => a - b)
    const avg = median(orderedByDuration)
    const getHeight = findCurve([min, MIN_Y], [avg, LINE_Y], [max, MAX_Y])

    return <DotGraph isLoading={isLoading} dots={dots} getHeight={getHeight} />
}

export default DotGraphWrapper

type DotGraphProps = {
    isLoading: boolean
    dots: DestinyHistoricalStatsPeriodGroup[]
    getHeight: (duration: number) => number
}

function DotGraph({ isLoading, dots, getHeight }: DotGraphProps) {
    const [dotTooltipData, setDotTooltipData] = useState<DotTooltipProps>({
        offset: {
            x: 0,
            y: 0
        },
        isShowing: false,
        activityCompleted: false,
        startDate: new Date(),
        duration: "",
        details: new RaidInfo([0, 0])
    })

    return (
        <div className={styles["dots-container"]} style={{ height: FULL_HEIGHT }}>
            <DotTooltip {...dotTooltipData} />
            {isLoading ? (
                <Loading />
            ) : (
                <svg
                    style={{
                        width: SPACING * dots.length + "px",
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
                    {dots.map((dot, idx) => (
                        <Dot
                            key={idx}
                            idx={idx}
                            id={dot.activityDetails.instanceId}
                            hash={
                                dot.activityDetails.directorActivityHash.toString() as ValidRaidHash
                            }
                            completed={!!dot.values.completed.basic.value}
                            star={
                                /*dot.values.deaths.basic.value === 0 || */ dot.values.playerCount
                                    .basic.value <= 3
                            }
                            duration={dot.values.activityDurationSeconds.basic.displayValue}
                            startDate={new Date(dot.period)}
                            cy={getHeight(dot.values.activityDurationSeconds.basic.value)}
                            setTooltip={setDotTooltipData}
                            tooltipData={dotTooltipData}
                        />
                    ))}
                </svg>
            )}
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
        const slope = (y2 - y1) / (s2 - s1)
        const b = y1 - slope * s1
        return slope * speed + b
    }

    const upper = (speed: number): number => {
        const slope = (y3 - y2) / (s3 - s2)
        const b = y2 - slope * s2
        return slope * speed + b
    }

    // Return the function to determine the Y coordinate depending on if the speed is above or below the median
    return (duration: number) => {
        return duration <= s2 ? lower(duration) : upper(duration)
    }
}
