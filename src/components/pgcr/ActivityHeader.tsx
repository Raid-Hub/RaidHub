import { useLanguage } from "../../hooks/language"
import Activity from "../../models/pgcr/Activity"
import styles from "../../styles/pgcr.module.css"
import { toCustomDateString } from "../../util/formatting"
import { LocalizedStrings } from "../../util/localized-strings"
import { ActivityPlacements, Loading } from "../../util/types"

type ActivityHeaderProps = {
    placements: ActivityPlacements | null
    activity: Activity | null
    pgcrLoadingState: Loading
}

const ActivityHeader = ({ activity, placements, pgcrLoadingState }: ActivityHeaderProps) => {
    const { language, locale } = useLanguage()
    const strings = LocalizedStrings[language]
    const checkpointDisclaimer = strings.checkPointDisclaimer
    const incomplete = strings.incompleteRaid
    return (
        <div className={styles["activity-card-header-container"]}>
            <div className={styles["activity-card-header-top"]}>
                <div className={styles["left-info"]}>
                    <div className={styles["raid-info-top"]}>
                        <span className={styles["completion-time"]}>
                            {!pgcrLoadingState && activity
                                ? toCustomDateString(activity.completionDate, locale)
                                : pgcrLoadingState === Loading.LOADING
                                ? "Loading..."
                                : "Hydrating..."}
                        </span>
                    </div>
                    <div className={styles["raid-name"]}>
                        <span>
                            {pgcrLoadingState === Loading.LOADING
                                ? "Loading..."
                                : strings.raidNames[activity!.raid]}
                        </span>
                    </div>
                </div>
                <div className={styles["right-info"]}>
                    <div className={styles.duration}>
                        {activity?.speed.duration.split(" ").map((t, idx) => (
                            <span key={idx}>
                                <b>{t.substring(0, t.length - 1)}</b>
                                {t[t.length - 1]}
                            </span>
                        ))}
                        {!(activity?.speed.complete ?? true) && (
                            <span>
                                <b>{`(${incomplete})`}</b>
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles["activity-card-header-attributes"]}>
                <div className={styles["tags-container"]}>
                    {activity?.tags(strings).map((tag, idx) => (
                        <div key={idx} className={[styles["soft-rectangle"], styles.tag].join(" ")}>
                            {tag}
                        </div>
                    ))}
                </div>
                {activity?.speed.fresh === null && (
                    <div className={styles["cp-error"]}>
                        <p>{checkpointDisclaimer}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ActivityHeader
