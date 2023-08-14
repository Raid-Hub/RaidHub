import styles from "../../styles/pages/pgcr.module.css"
import { Loading } from "../../types/generic"
import { toCustomDateString } from "../../util/presentation/formatting"
import { useLocale } from "../app/LocaleManager"
import { Raid } from "../../types/raids"
import { usePGCRContext } from "../../pages/pgcr/[activityId]"

const ActivityHeader = () => {
    const { pgcr, loadingState } = usePGCRContext()
    const { strings, locale } = useLocale()
    const checkpointDisclaimer = strings.checkPointDisclaimer
    const incomplete = strings.incompleteRaid

    return (
        <div className={styles["activity-tile-header-container"]}>
            <div className={styles["activity-tile-header-top"]}>
                <div className={styles["left-info"]}>
                    <div className={styles["raid-info-top"]}>
                        <span className={styles["completion-time"]}>
                            {!loadingState && pgcr
                                ? toCustomDateString(pgcr.completionDate, locale)
                                : loadingState === Loading.LOADING
                                ? "Loading..."
                                : "Hydrating..."}
                        </span>
                    </div>
                    <div className={styles["raid-name"]}>
                        {loadingState === Loading.LOADING || !pgcr ? (
                            <span>{strings.loading}</span>
                        ) : (
                            <span>{strings.raidNames[pgcr.raid ?? Raid.NA]}</span>
                        )}
                    </div>
                </div>
                <div className={styles["right-info"]}>
                    <div className={styles.duration}>
                        {pgcr?.speed
                            .string(strings)
                            .split(" ")
                            .map((t, idx) => (
                                <span key={idx}>
                                    <b>{t.substring(0, t.length - 1)}</b>
                                    {t[t.length - 1]}
                                </span>
                            ))}
                        {!(pgcr?.completed ?? true) && (
                            <span>
                                <b>{`(${incomplete})`}</b>
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles["activity-tile-header-attributes"]}>
                <div className={styles["tags-container"]}>
                    {pgcr?.tags.map((tag, idx) => (
                        <div key={idx} className={styles["tag"]}>
                            {strings.tags[tag]}
                        </div>
                    ))}
                </div>
                {pgcr?.wasFresh() === null && (
                    <div className={styles["cp-error"]}>
                        <p>{checkpointDisclaimer}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ActivityHeader
