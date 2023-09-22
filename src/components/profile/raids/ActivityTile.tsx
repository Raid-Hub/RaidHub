import styles from "../../../styles/pages/profile/raids.module.css"
import Link from "next/link"
import { useLocale } from "../../app/LocaleManager"
import { raidVersion } from "../../../util/destiny/raidUtils"
import Activity from "../../../models/profile/data/Activity"
import { useMemo } from "react"
import { Tag } from "../../../util/raidhub/tags"
import Image from "next/image"
import RaidCardBackground from "../../../images/raid-backgrounds"
import { m } from "framer-motion"

type ActivityTileProps = { activity: Activity }

const ActivityTile = ({
    activity: { startDate, raid, difficulty, endDate, instanceId, completed, playerCount, flawless }
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
        <Link href={`/pgcr/${instanceId}`} className={styles["activity"]} legacyBehavior>
            <m.a
                initial={{
                    y: 50,
                    opacity: 0
                }}
                whileInView={{
                    y: 0,
                    opacity: 1
                }}
                viewport={{ once: true }}
                transition={{
                    duration: 0.6
                }}
                className={styles["activity"]}>
                <Image
                    src={RaidCardBackground[raid]}
                    alt={`Raid card for ${strings.raidNames[raid]}`}
                    fill
                    sizes="160px"
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
            </m.a>
        </Link>
    )
}

export default ActivityTile
