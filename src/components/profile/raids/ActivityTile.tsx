import styles from "../../../styles/pages/profile/raids.module.css"
import { Difficulty, RaidCardBackground } from "../../../util/destiny/raid"
import { LocalStrings } from "../../../util/presentation/localized-strings"
import Link from "next/link"
import RaidInfo from "../../../models/pgcr/RaidInfo"

type ActivityTileProps = {
    strings: LocalStrings
    info: RaidInfo
    completed: boolean
    activityId: any
    completionDate: Date
}

const ActivityTile = ({
    info,
    strings,
    completed,
    activityId,
    completionDate
}: ActivityTileProps) => {
    const difficultyString = [Difficulty.CHALLENGEKF, Difficulty.CHALLENGEVOG].includes(
        info.difficulty
    )
        ? strings.difficulty[info.difficulty]
        : info.isDayOne(completionDate)
        ? strings.dayOne
        : info.isContest(completionDate)
        ? strings.contest
        : info.difficulty !== Difficulty.NORMAL
        ? strings.difficulty[info.difficulty]
        : ""
    return (
        <Link
            href={`/pgcr/${activityId}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles["activity"]}>
            <img
                src={RaidCardBackground[info.raid]}
                alt={`Raid card for ${strings.raidNames[info.raid]}`}
                className={styles["activity-content-img"]}
            />
            <p className={styles["activity-title"]}>
                {`${difficultyString ? difficultyString + " " : ""}${strings.raidNames[info.raid]}`}
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
