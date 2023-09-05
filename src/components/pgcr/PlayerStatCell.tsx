import Image, { StaticImageData } from "next/image"
import styles from "../../styles/pages/pgcr.module.css"

const PlayerStatCell = ({
    icon,
    value,
    name
}: {
    icon: StaticImageData
    name: string
    value: number | string
}) => {
    return (
        <div className={[styles["entry-card"], styles["character-stat"]].join(" ")}>
            <Image
                src={icon}
                alt={name + ": " + value}
                className={styles["stat-icon"]}
                width={30}
                height={30}
            />
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
