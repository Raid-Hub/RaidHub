import { useLocale } from "~/app/layout/managers/LocaleManager"
import { useRaidHubManifest } from "~/app/layout/managers/RaidHubManifestManager"
import { usePGCRContext } from "~/app/pgcr/PGCRStateManager"
import { useTags } from "~/app/pgcr/hooks/useTags"
import { secondsToHMS, toCustomDateString } from "~/util/presentation/formatting"
import styles from "../pgcr.module.css"

/** @deprecated */
const ActivityHeader = () => {
    const { completionDate, completed, duration, activity, fresh, isLoading, raid } =
        usePGCRContext()

    const { locale } = useLocale()
    const { getRaidString } = useRaidHubManifest()
    const tags = useTags(activity ?? null)

    return (
        <div className={styles["activity-tile-header-container"]}>
            <div className={styles["activity-tile-header-top"]}>
                <div className={styles["left-info"]}>
                    <div className={styles["raid-info-top"]}>
                        <span className={styles["completion-time"]}>
                            {completionDate
                                ? toCustomDateString(completionDate, locale)
                                : "Loading..."}
                        </span>
                    </div>
                    <div className={styles["raid-name"]}>
                        {isLoading ? (
                            <span>Loading...</span>
                        ) : raid ? (
                            getRaidString(raid)
                        ) : (
                            "Non-Raid"
                        )}
                    </div>
                </div>
                <div className={styles["right-info"]}>
                    <div className={styles.duration}>
                        {typeof duration !== "undefined" &&
                            secondsToHMS(duration, false)
                                .split(" ")
                                .map((t, idx) => (
                                    <span key={idx}>
                                        <b>{t.substring(0, t.length - 1)}</b>
                                        {t[t.length - 1]}
                                    </span>
                                ))}
                        {completed === false && (
                            <span>
                                <b>{"(Incomplete)"}</b>
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles["activity-tile-header-attributes"]}>
                <div className={styles["tags-container"]}>
                    {tags.map(({ tag, placement }, idx) => (
                        <div key={idx} className={styles.tag}>
                            {tag}
                            {placement && ` #${placement}`}
                        </div>
                    ))}
                </div>
                {fresh === null && (
                    <div className={styles["cp-error"]}>
                        <p>Note: this activity may or may not be a checkpoint</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ActivityHeader
