import Link from "next/link"
import { useLanguage } from "../../hooks/useLanguage"
import { usePGCR } from "../../hooks/bungie/usePGCR"
import styles from "../../styles/profile.module.css"
import { LocalizedStrings } from "../../util/localized-strings"
import { RaidBanner } from "../../util/raid"
import Loading from "../Loading"
import { Icons } from "../../util/icons"
import { toCustomDateString } from "../../util/formatting"
import { ErrorHandler } from "../../util/types"

type PinnedActivityProps = {
    activityId?: string | null
    errorHandler: ErrorHandler
}

const PinnedActivity = ({ activityId, errorHandler }: PinnedActivityProps) => {
    const { activity, loadingState: pgcrLoadingState } = usePGCR({ activityId, errorHandler })
    const { language, locale } = useLanguage()
    const strings = LocalizedStrings[language]
    if (pgcrLoadingState)
        return (
            <div className={styles["pinned-activity-wrapper"]}>
                <div className={styles["pinned-activity-loading"]}>
                    <Loading />
                </div>
            </div>
        )
    else if (!activity) return <div className={styles["pinned-activity-wrapper"]}></div>
    else
        return (
            <div className={styles["pinned-activity-wrapper"]}>
                <a href={`/pgcr/${activityId}`}>
                    <div className={styles["pinned-activity"]}>
                        <div
                            className={["background-img", styles["pinned-background"]].join(" ")}
                            style={{
                                backgroundImage: `url('${RaidBanner[activity.raid]}')`
                            }}
                        />
                        <img className={styles["pin"]} src={Icons.PIN} alt="" />

                        <div className={styles["card-header-text"]}>
                            <p className={styles["card-header-title"]}>{activity.title(strings)}</p>
                        </div>
                        <div className={styles["card-header-subtext"]}>
                            <p>{toCustomDateString(activity.completionDate, locale)}</p>

                            <div className={styles["card-header-time"]}>
                                <img src={Icons.SPEED} alt="" width="20px" height="20px" />
                                <span>{activity.speed.duration}</span>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        )
}

export default PinnedActivity
