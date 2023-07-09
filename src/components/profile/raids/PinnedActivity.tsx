import styles from "../../../styles/pages/profile/raids.module.css"
import { RaidBanner } from "../../../types/raids"
import Loading from "../../global/Loading"
import { Icons } from "../../../util/presentation/icons"
import { toCustomDateString } from "../../../util/presentation/formatting"
import { ErrorHandler } from "../../../types/generic"
import { useActivity } from "../../../hooks/bungie/useActivity"
import { useLocale } from "../../app/LanguageProvider"

type PinnedActivityProps = {
    isLoading: boolean
    activityId: string | null | undefined
    isPinned: boolean
    errorHandler: ErrorHandler
}

const PinnedActivity = ({
    activityId,
    errorHandler,
    isPinned,
    isLoading: isLoadingData
}: PinnedActivityProps) => {
    const { pgcr, isLoading: isLoadingActivity } = useActivity({ activityId, errorHandler })
    const { locale, strings } = useLocale()
    return isLoadingData || isLoadingActivity ? (
        <Loading wrapperClass={styles["pinned-activity-loading"]} />
    ) : (
        pgcr && (
            <a href={`/pgcr/${activityId}`} className={styles["pinned-activity"]}>
                <div
                    className={["background-img", styles["pinned-background"]].join(" ")}
                    style={{
                        backgroundImage: `url('${RaidBanner[pgcr.raid]}')`
                    }}
                />
                {isPinned ? (
                    <img className={styles["pin-icon"]} src={Icons.PIN} alt="pinned" />
                ) : (
                    <img className={styles["recent-icon"]} src={Icons.TIME} alt="pinned" />
                )}

                <div className={styles["pinned-activity-text"]}>
                    <p className={styles["pinned-activity-title"]}>{pgcr.title(strings)}</p>
                </div>
                <div className={styles["pinned-activity-subtext"]}>
                    <p>{toCustomDateString(pgcr.completionDate, locale)}</p>

                    <div className={styles["pinned-activity-time"]}>
                        <img src={Icons.SPEED} alt="" width="20px" height="20px" />
                        <span>{pgcr.speed.string(strings)}</span>
                    </div>
                </div>
            </a>
        )
    )
}

export default PinnedActivity
