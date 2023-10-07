import styles from "~/styles/pages/pgcr.module.css"
import { SVGComponent } from "../../reusable/SVG"

const PlayerStatCell = ({
    icon: Icon,
    value,
    name
}: {
    icon: SVGComponent
    name: string
    value: number | string
}) => {
    return (
        <div className={[styles["entry-card"], styles["character-stat"]].join(" ")}>
            <div className={styles["stat-icon-container"]}>
                <Icon color="white" />
            </div>
            <div className={styles["summary-stat-info"]}>
                <span className={[styles["summary-stat-name"], styles["contained-span"]].join(" ")}>
                    {name}
                </span>
                <span
                    className={[styles["summary-stat-value"], styles["contained-span"]].join(" ")}>
                    {value}
                </span>
            </div>
        </div>
    )
}

export default PlayerStatCell
