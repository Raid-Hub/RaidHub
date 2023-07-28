import styles from "../../styles/pages/pgcr.module.css"
import DestinyPGCR from "../../models/pgcr/PGCR"
import { Loading } from "../../types/generic"
import { toCustomDateString } from "../../util/presentation/formatting"
import html2canvas from "html2canvas"
import { useState } from "react"
import { useLocale } from "../app/LocaleManager"
import { Raid } from "../../types/raids"

type ActivityHeaderProps = {
    activity: DestinyPGCR | undefined | null
    pgcrLoadingState: Loading
}

const ActivityHeader = ({ activity, pgcrLoadingState }: ActivityHeaderProps) => {
    const { strings, locale } = useLocale()
    const checkpointDisclaimer = strings.checkPointDisclaimer
    const incomplete = strings.incompleteRaid
    const [copied, setCopied] = useState(false)

    const handleScreenshot = async () => {
        const element: HTMLElement = document.getElementById("screenshot-container")!
        const canvas = await html2canvas(element, { backgroundColor: null, scale: 5 })

        canvas.toBlob(async function (blob) {
            if (blob) {
                try {
                    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
                    setCopied(true)
                    setTimeout(() => {
                        setCopied(false)
                    }, 3000)
                } catch (error) {
                    console.log(error)
                }
            }
        })
    }

    return (
        <div className={styles["activity-tile-header-container"]}>
            <div className={styles["activity-tile-header-top"]}>
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
                        {pgcrLoadingState === Loading.LOADING || !activity ? (
                            <span>{strings.loading}</span>
                        ) : (
                            <span>{strings.raidNames[activity.raid ?? Raid.NA]}</span>
                        )}
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
            <div className={styles["activity-tile-header-attributes"]}>
                <div className={styles["tags-container"]}>
                    {activity?.tags.map((tag, idx) => (
                        <div key={idx} className={styles["tag"]}>
                            {strings.tags[tag]}
                        </div>
                    ))}
                </div>
                {activity?.wasFresh() === null && (
                    <div className={styles["cp-error"]}>
                        <p>{checkpointDisclaimer}</p>
                    </div>
                )}
                <button className={styles["screenshot-button"]} onClick={handleScreenshot}>Screenshot</button>
            </div>
        </div>
    )
}

export default ActivityHeader
