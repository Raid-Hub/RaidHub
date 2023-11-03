import styles from "~/styles/pages/pgcr.module.css"
import { toCustomDateString } from "~/util/presentation/formatting"
import { useLocale } from "~/components/app/LocaleManager"
import { Raid } from "~/types/raids"
import { usePGCRContext } from "../PGCR"
import { useRaidHubActivity } from "~/hooks/raidhub/useRaidHubActivity"

const ActivityHeader = () => {
    const { data: pgcr, isLoading, activityId } = usePGCRContext()
    const { strings, locale } = useLocale()
    const { data: activity } = useRaidHubActivity(activityId)

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
                                <b>{`(${strings.incompleteRaid})`}</b>
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
                                {strings.tags[tag]}
                                {placement && placementTag(placement)}
                            </div>
                        ))}
                </div>
                {activity?.fresh === null && (
                    <div className={styles["cp-error"]}>
                        <p>{strings.checkPointDisclaimer}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function placementTag(placement: number) {
    if (placement <= 500) {
        return ` #${placement}`
    } else if (placement <= 1000) {
        return " Top 1000"
    } else if (placement <= 5000) {
        return " Top 5000"
    } else {
        return ""
    }
}

export default ActivityHeader
