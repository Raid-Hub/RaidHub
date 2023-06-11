import styles from "../../styles/profile.module.css"
import { RADIUS, SPACING } from "./DotGraph"

const red = "#F44336"
const green = "#4CAF50"

type DotProps = {
    idx: number
    id: string
    completed: boolean
    star: boolean
    cy: number
}

const Dot = ({ idx, id, completed, star, cy }: DotProps) => {
    const cx = SPACING / 2 + SPACING * idx
    return (
        <a
            href={`/pgcr/${id}`}
            className={[styles["dot"], styles["dot-hover"]].join(" ")}
            aria-describedby="dot-hover-tooltip">
            <circle
                fill={completed ? green : red}
                fillOpacity="0.9783869573466908"
                r={RADIUS}
                cx={cx}
                cy={cy}></circle>
            {star && <Star x={cx} y={cy} />}
        </a>
    )
}

type StarProps = { x: number; y: number }
const Star = ({ x, y }: StarProps) => {
    // top
    // y = 6

    // arms
    // cos(18) = x / 6
    // x = cos(18) * 6
    // cos(18) = 0.95105651629
    // x = 5.70633909777
    // sin(18) = y / 6
    // y = sin(18) * 6
    // sin(18) = 0.30901699437
    // y = 1.85410196625

    // legs
    // sin(36) = x / 6
    // x = sin(36) * 6
    // sin(36) = 0.58778525229
    // x = 3.52671151375
    // cos(36) = y / 6
    // y = cos(36) * 6
    // cos(36) = 0.80901699437
    // y = 4.85410196625
    const points: [x: number, y: number][] = [
        [x, y - 6],
        [x - 3.52671151375, y + 4.85410196625],
        [x + 5.70633909777, y - 1.85410196625],
        [x - 5.70633909777, y - 1.85410196625],
        [x + 3.52671151375, y + 4.85410196625]
    ]
    return <polygon fill="#ffffff" points={points.map(coords => coords.join(",")).join(" ")} />
}

export default Dot
