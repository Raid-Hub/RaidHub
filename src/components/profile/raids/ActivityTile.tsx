import styles from "../../../styles/pages/profile/raids.module.css"
import Link from "next/link"
import { useLocale } from "../../app/LanguageProvider"
import { raidVersion } from "../../../util/destiny/raid"
import Activity from "../../../models/profile/Activity"
import { useMemo } from "react"
import { Tag } from "../../../util/raidhub/tags"
import Image from "next/image"
import RaidCardBackground from "../../../images/raid-backgrounds"

type ActivityTileProps = {
    activity: Activity
    playerCount: number | undefined
    flawless: boolean | null | undefined
}

const ActivityTile = ({
    activity: { startDate, raid, difficulty, endDate, instanceId, completed },
    playerCount,
    flawless
}: ActivityTileProps) => {
    const { strings } = useLocale()
    const difficultyString = raidVersion([raid, difficulty], startDate, endDate, strings, false)
    const lowManString = useMemo(() => {
        switch (playerCount) {
            case 1:
                return strings.tags[Tag.SOLO]
            case 2:
                return strings.tags[Tag.DUO]
            case 3:
                return strings.tags[Tag.TRIO]
        }
    }, [playerCount, strings])

    const flawlessString = useMemo(() => {
        if (flawless === true) {
            return strings.tags[Tag.FLAWLESS]
        } else if (flawless === null) {
            return strings.tags[Tag.FLAWLESS] + "*"
        }
    }, [flawless, strings])

    return (
        <Link href={`/pgcr/${instanceId}`} className={styles["activity"]}>
            <Image
                src={RaidCardBackground[raid]}
                alt={`Raid card for ${strings.raidNames[raid]}`}
                className={styles["activity-content-img"]}
            />
            <p className={styles["activity-title"]}>
                {[lowManString, flawlessString, difficultyString, strings.raidNames[raid]]
                    .filter(Boolean) // filters out falsy values
                    .join(" ")}
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
