import { useLocale } from "~/app/layout/managers/LocaleManager"
import { useRaidHubManifest } from "~/app/layout/managers/RaidHubManifestManager"
import { usePGCRContext } from "~/app/pgcr/PGCRStateManager"
import { usePGCRTags } from "~/app/pgcr/hooks/usePGCRTags"
import { includedIn } from "~/util/helpers"
import { secondsToHMS, toCustomDateString } from "~/util/presentation/formatting"
import styles from "../pgcr.module.css"

/** @deprecated */
const ActivityHeader = () => {
    const { data, isLoading } = usePGCRContext()

    const { locale } = useLocale()
    const { getRaidString, getVersionString, listedRaids, pantheonModes } = useRaidHubManifest()
    const tags = usePGCRTags(data ?? null)

    const activityId = data?.meta.activityId

    return (
        <div className={styles["activity-tile-header-container"]}>
            <div className={styles["activity-tile-header-top"]}>
                <div className={styles["left-info"]}>
                    <div className={styles["raid-info-top"]}>
                        <span className={styles["completion-time"]}>
                            {data?.dateCompleted
                                ? toCustomDateString(new Date(data.dateCompleted), locale)
                                : "Loading..."}
                        </span>
                    </div>
                    <div className={styles["raid-name"]}>
                        {isLoading ? (
                            <span>Loading...</span>
                        ) : includedIn(listedRaids, activityId) ? (
                            getRaidString(activityId)
                        ) : includedIn(pantheonModes, data?.meta.versionId) ? (
                            data.meta.activityName + ": " + getVersionString(data.meta.versionId)
                        ) : (
                            "Non-Raid"
                        )}
                    </div>
                </div>
                <div className={styles["right-info"]}>
                    <div className={styles.duration}>
                        {data?.duration &&
                            secondsToHMS(data.duration, false)
                                .split(" ")
                                .map((t, idx) => (
                                    <span key={idx}>
                                        <b>{t.substring(0, t.length - 1)}</b>
                                        {t[t.length - 1]}
                                    </span>
                                ))}
                        {data?.completed === false && (
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
                {data?.fresh === null && (
                    <div className={styles["cp-error"]}>
                        <p>Note: this activity may or may not be a checkpoint</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ActivityHeader
