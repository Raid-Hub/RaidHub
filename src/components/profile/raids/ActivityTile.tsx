import styles from "../../../styles/pages/profile/raids.module.css"
import { RaidCardBackground, RaidDifficultyTuple } from "../../../types/raids"
import Link from "next/link"
import { useLocale } from "../../app/LanguageProvider"
import { raidVersion } from "../../../util/destiny/raid"
import Activity from "../../../models/profile/Activity"

type ActivityTileProps = Activity

const ActivityTile = ({
    startDate,
    raid,
    difficulty,
    endDate,
    instanceId,
    completed
}: ActivityTileProps) => {
    const { strings } = useLocale()
    const difficultyString = raidVersion([raid, difficulty], startDate, endDate, strings)
    return (
        <Link
            href={`/pgcr/${instanceId}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles["activity"]}>
            <img
                src={RaidCardBackground[raid]}
                alt={`Raid card for ${strings.raidNames[raid]}`}
                className={styles["activity-content-img"]}
            />
            <p className={styles["activity-title"]}>
                {`${difficultyString ? difficultyString + " " : ""}${strings.raidNames[raid]}`}
            </p>

            <div className={styles["success-layer"]}>
                <p style={{ color: completed ? "#98e07b" : "#FF0000" }}>
                    {completed ? strings.success : strings.incompleteRaid}
                </p>
            </div>
        </Link>
    )
}

export default ActivityTile
