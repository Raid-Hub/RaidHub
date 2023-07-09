import styles from "../../../styles/pages/profile/raids.module.css"
import { RaidCardBackground, RaidDifficultyTuple } from "../../../types/raids"
import Link from "next/link"
import { useLocale } from "../../app/LanguageProvider"
import { raidVersion } from "../../../util/destiny/raid"

type ActivityTileProps = {
    info: RaidDifficultyTuple
    completed: boolean
    activityId: any
    startDate: Date
    completionDate: Date
}

const ActivityTile = ({
    info,
    completed,
    activityId,
    startDate,
    completionDate
}: ActivityTileProps) => {
    const { strings } = useLocale()
    const difficultyString = raidVersion(info, startDate, completionDate, strings)
    return (
        <Link
            href={`/pgcr/${activityId}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles["activity"]}>
            <img
                src={RaidCardBackground[info[0]]}
                alt={`Raid card for ${strings.raidNames[info[0]]}`}
                className={styles["activity-content-img"]}
            />
            <p className={styles["activity-title"]}>
                {`${difficultyString ? difficultyString + " " : ""}${strings.raidNames[info[0]]}`}
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
