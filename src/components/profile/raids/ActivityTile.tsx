import { m } from "framer-motion"
import Link from "next/link"
import { useMemo } from "react"
import RaidCardBackground from "~/data/raid-backgrounds"
import CloudflareImage from "~/images/CloudflareImage"
import Activity from "~/models/profile/data/Activity"
import styles from "~/styles/pages/profile/raids.module.css"
import { toCustomDateString } from "~/util/presentation/formatting"
import { Tag } from "~/util/tags"
import { useLocale } from "../../app/LocaleManager"

const ActivityTile = ({ activity }: { activity: Activity }) => {
    const { locale } = useLocale()
    const difficultyString = raidVersion(activity, strings, false)
    const lowManString = useMemo(() => {
        switch (activity.playerCount) {
            case 1:
                return strings.tags[Tag.SOLO]
            case 2:
                return strings.tags[Tag.DUO]
            case 3:
                return strings.tags[Tag.TRIO]
        }
    }, [activity.playerCount, strings])

    const flawlessString = useMemo(() => {
        if (activity.flawless === true) {
            return strings.tags[Tag.FLAWLESS]
        } else if (activity.flawless === null) {
            return strings.tags[Tag.FLAWLESS] + "*"
        }
    }, [activity.flawless, strings])

    return (
        <Link href={`/pgcr/${activity.activityId}`} className={styles["activity"]} legacyBehavior>
            <m.a
                href={`/pgcr/${activity.activityId}`}
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
                    cloudflareId={RaidCardBackground[activity.raid]}
                    alt={`Raid card for ${strings.raidNames[activity.raid]}`}
                    fill
                    sizes="160px"
                    className={styles["activity-content-img"]}
                />
                <div className={styles["hover-date"]}>
                    {toCustomDateString(activity.dateCompleted, locale)}
                </div>
                <p className={styles["activity-title"]}>
                    {[
                        lowManString,
                        flawlessString,
                        difficultyString,
                        strings.raidNames[activity.raid]
                    ]
                        .filter(Boolean) // filters out falsy values
                        .join(" ")}
                </p>

                <div className={styles["success-layer"]}>
                    <p style={{ color: activity.completed ? "#98e07b" : "#FF0000" }}>
                        {activity.completed ? strings.success : strings.incompleteRaid}
                    </p>
                </div>
            </m.a>
        </Link>
    )
}

export default ActivityTile
