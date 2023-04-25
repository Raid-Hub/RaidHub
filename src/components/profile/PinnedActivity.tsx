import Link from "next/link"
import { useLanguage } from "../../hooks/language"
import { usePGCR } from "../../hooks/pgcr"
import styles from "../../styles/profile.module.css"
import { LocalizedStrings } from "../../util/localized-strings"
import { RaidBanner } from "../../util/raid"
import Loading from "../Loading"
import { Icons } from "../../util/icons"

type PinnedActivityProps = {
    activityId?: string | null
}

const PinnedActivity = ({ activityId }: PinnedActivityProps) => {
    const { activity, loadingState: pgcrLoadingState } = usePGCR(activityId)
    const language = useLanguage()
    const strings = LocalizedStrings[language]
    if (pgcrLoadingState)
        return (
            <div className={styles["pinned-activity-loading"]}>
                <Loading />
            </div>
        )
    else if (!activity) return <></>
    else
        return (
            <Link href={`/pgcr/${activityId}`}>
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
                        <p>
                            {activity.completionDate.toLocaleDateString(navigator.language, {
                                month: "long",
                                day: "numeric",
                                year: "numeric"
                            })}
                        </p>

                        <div className={styles["card-header-time"]}>
                            <img src={Icons.SPEED} alt="" width="20px" height="20px" />
                            <span>{activity.speed.duration}</span>
                        </div>
                    </div>
                </div>
            </Link>
        )
}

export default PinnedActivity
