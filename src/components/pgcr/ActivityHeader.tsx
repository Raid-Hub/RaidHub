import DestinyPGCR from "../../models/pgcr/PGCR"
import styles from "../../styles/pgcr.module.css"
import { Loading } from "../../types/generic"
import { toCustomDateString } from "../../util/presentation/formatting"
import { useLocale } from "../app/LanguageProvider"

type ActivityHeaderProps = {
    activity: DestinyPGCR | null
    pgcrLoadingState: Loading
}

const ActivityHeader = ({ activity, pgcrLoadingState }: ActivityHeaderProps) => {
    const { strings, locale } = useLocale()
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
                                : strings.raidNames[activity!.details.raid]}
                        </span>
                    </div>
                </div>
                <div className={styles["right-info"]}>
                    <div className={styles.duration}>
                        {activity?.speed
                            .string(strings)
                            .split(" ")
                            .map((t, idx) => (
                                <span key={idx}>
                                    <b>{t.substring(0, t.length - 1)}</b>
                                    {t[t.length - 1]}
                                </span>
                            ))}
                        {!(activity?.completed ?? true) && (
                            <span>
                                <b>{`(${incomplete})`}</b>
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles["activity-card-header-attributes"]}>
                <div className={styles["tags-container"]}>
                    {activity?.tags.map((tag, idx) => (
                        <div key={idx} className={styles["tag"]}>
                            {tag}
                        </div>
                    ))}
                </div>
                {activity?.wasFresh() === null && (
                    <div className={styles["cp-error"]}>
                        <p>{checkpointDisclaimer}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ActivityHeader
