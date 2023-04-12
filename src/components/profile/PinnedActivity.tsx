import Link from 'next/link';
import { useLanguage } from '../../hooks/language';
import { usePGCR } from '../../hooks/pgcr';
import styles from '../../styles/profile.module.css';
import { LocalizedStrings } from '../../util/localized-strings';
import { RaidBanner } from '../../util/raid';
import Loading from '../Loading';

type PinnedActivityProps = {
    activityId: string
}

const PinnedActivity = ({ activityId }: PinnedActivityProps) => {
    const { activity, isLoading: isLoadingActivity } = usePGCR(activityId)
    const language = useLanguage()
    const strings = LocalizedStrings[language]
    if (isLoadingActivity || !activity) return (
        <div className={styles["pinned-activity"]}>
            <Loading/>
        </div>
    )
    else return (
        <Link
        href={`/pgcr/${activityId}`}
        target="_blank"
        rel="noopener noreferrer">
            <div className={styles["pinned-activity"]}>
                <div className={[ "background-img", styles["pinned-background"]].join(" ")} style={{
                    backgroundImage: `url('${RaidBanner[activity.raid]}')`
                }} />
                <img className={styles["pin"]} src="/icons/pin.png" alt="" />

                <div className={styles["card-header-text"]}>
                    <p className={styles["card-header-title"]}>{activity.title(strings)}</p>
                </div>
                <div className={styles["card-header-subtext"]}>
                    <p>{activity.completionDate.toLocaleDateString(navigator.language, {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                    })}</p>

                    <div className={styles["card-header-time"]}>
                        <img src="/icons/speed.png" alt="" width="20px" height="20px" />
                        <span>{activity.speed.duration}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default PinnedActivity;