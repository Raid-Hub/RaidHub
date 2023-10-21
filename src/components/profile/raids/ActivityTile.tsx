import styles from "~/styles/pages/profile/raids.module.css"
import Link from "next/link"
import { useLocale } from "../../app/LocaleManager"
import { raidVersion } from "../../../util/destiny/raidUtils"
import Activity from "../../../models/profile/data/Activity"
import { useMemo } from "react"
import { Tag } from "../../../util/raidhub/tags"
import { m } from "framer-motion"
import RaidCardBackground from "~/images/raid-backgrounds"
import CloudflareImage from "~/images/CloudflareImage"
import { toCustomDateString } from "~/util/presentation/formatting"

type ActivityTileProps = { activity: Activity }

const ActivityTile = ({
    activity: {
        dateStarted,
        raid,
        difficulty,
        dateCompleted,
        activityId,
        completed,
        playerCount,
        flawless
    }
}: ActivityTileProps) => {
    const { strings, locale } = useLocale()
    const difficultyString = raidVersion(
        [raid, difficulty],
        dateStarted,
        dateCompleted,
        strings,
        false
    )
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
        <Link href={`/pgcr/${activityId}`} className={styles["activity"]} legacyBehavior>
            <m.a
                href={`/pgcr/${activityId}`}
                initial={{
                    y: 50,
                    opacity: 0
                }}
                whileInView={{
                    y: 0,
                    opacity: 1
                }}
                viewport={{ once: true }}
                whileHover={{
                    scale: 1.035
                }}
                className={styles["activity"]}>
                <CloudflareImage
                    cloudflareId={RaidCardBackground[raid]}
                    alt={`Raid card for ${strings.raidNames[raid]}`}
                    fill
                    sizes="160px"
                    className={styles["activity-content-img"]}
                />
                <div className={styles["hover-date"]}>
                    {toCustomDateString(dateCompleted, locale)}
                </div>
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
