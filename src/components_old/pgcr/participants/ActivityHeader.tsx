import { useLocale } from "~/app/managers/LocaleManager"
import { useRaidHubManifest } from "~/app/managers/RaidHubManifestManager"
import { TagStrings } from "~/data/strings/activity-tags"
import { useRaidHubActivity } from "~/hooks/raidhub/useRaidHubActivity"
import styles from "~/styles/pages/pgcr.module.css"
import { secondsToHMS, toCustomDateString } from "~/util/presentation/formatting"
import { usePGCRContext } from "../PGCR"

const ActivityHeader = () => {
    const { data: pgcr, isLoading, activityId } = usePGCRContext()
    const { locale } = useLocale()
    const { data: activity } = useRaidHubActivity(activityId)
    const { getRaidString } = useRaidHubManifest()

    return (
        <div className={styles["activity-tile-header-container"]}>
            <div className={styles["activity-tile-header-top"]}>
                <div className={styles["left-info"]}>
                    <div className={styles["raid-info-top"]}>
                        <span className={styles["completion-time"]}>
                            {!isLoading
                                ? toCustomDateString(pgcr.completionDate, locale)
                                : "Loading..."}
                        </span>
                    </div>
                    <div className={styles["raid-name"]}>
                        {isLoading ? (
                            <span>Loading...</span>
                        ) : (
                            <span>{pgcr.raid ? getRaidString(pgcr.raid) : "Non-Raid"}</span>
                        )}
                    </div>
                </div>
                <div className={styles["right-info"]}>
                    <div className={styles.duration}>
                        {pgcr &&
                            secondsToHMS(pgcr.speed)
                                .split(" ")
                                .map((t, idx) => (
                                    <span key={idx}>
                                        <b>{t.substring(0, t.length - 1)}</b>
                                        {t[t.length - 1]}
                                    </span>
                                ))}
                        {!(pgcr?.completed ?? true) && (
                            <span>
                                <b>{"(Incomplete)"}</b>
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles["activity-tile-header-attributes"]}>
                <div className={styles["tags-container"]}>
                    {activity &&
                        pgcr?.tags(activity).map(({ tag, placement }, idx) => (
                            <div key={idx} className={styles["tag"]}>
                                {TagStrings[tag]}
                                {placement && ` #${placement}`}
                            </div>
                        ))}
                </div>
                {activity?.fresh === null && (
                    <div className={styles["cp-error"]}>
                        <p>
                            Note: this report may or may not be a checkpoint due to API issues from
                            Season of the Hunt through Season of the Risen
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ActivityHeader
