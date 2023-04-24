import { useLanguage } from "../../hooks/language"
import Activity from "../../models/pgcr/Activity"
import styles from "../../styles/pgcr.module.css"
import { LocalizedStrings } from "../../util/localized-strings"
import { ActivityPlacements, Loading } from "../../util/types"

type ActivityHeaderProps = {
    placements: ActivityPlacements | null
    activity: Activity | null
    pgcrLoadingState: Loading
}

const ActivityHeader = ({ activity, placements, pgcrLoadingState }: ActivityHeaderProps) => {
    const language = useLanguage()
    if (placements && activity) activity.placements = placements
    const strings = LocalizedStrings[language]
    const checkpointDisclaimer = strings.checkPointDisclaimer
    const incomplete = strings.incompleteRaid
    return (
        <div className={styles["activity-card-header-container"]}>
            <div id={styles["activity-card-header"]}>
                <div id={styles["left-info"]}>
                    <div id={styles["raid-info-top"]}>
                        <span id={styles["completion-time"]}>
                            {!pgcrLoadingState
                                ? activity?.completionDate.toLocaleDateString(navigator.language, {
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric"
                                  })
                                : pgcrLoadingState === Loading.LOADING
                                ? "Loading..."
                                : "Hydrating..."}
                        </span>
                    </div>
                    <div id={styles["raid-name"]}>
                        <span>
                            {!pgcrLoadingState
                                ? strings.raidNames[activity!.raid]
                                : pgcrLoadingState === Loading.LOADING
                                ? "Loading..."
                                : "Hydrating..."}
                        </span>
                    </div>
                    {activity?.speed.fresh === null && (
                        <div id={styles["cp-error"]}>
                            <p>{checkpointDisclaimer}</p>
                        </div>
                    )}
                </div>
                <div id={styles["right-info"]}>
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
            <div id={styles["tags-container"]}>
                {activity?.tags(strings).map((tag, idx) => (
                    <div key={idx} className={[styles["soft-rectangle"], styles.tag].join(" ")}>
                        {tag}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ActivityHeader
