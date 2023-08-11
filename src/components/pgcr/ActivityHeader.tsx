import styles from "../../styles/pages/pgcr.module.css"
import DestinyPGCR from "../../models/pgcr/PGCR"
import { Loading } from "../../types/generic"
import { toCustomDateString } from "../../util/presentation/formatting"
import html2canvas from "html2canvas"
import { useState } from "react"
import { useLocale } from "../app/LocaleManager"
import { Raid } from "../../types/raids"
import { motion } from "framer-motion"

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
        const canvas = await html2canvas(element, { backgroundColor: null, scale: 5, useCORS: true})

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
                {/* TODO disable initial page load animations for button & SVGs*/}
                <motion.button
                    className={styles["screenshot-button"]}
                    onClick={handleScreenshot}
                    data-html2canvas-ignore={true}
                    animate={
                        copied
                            ? {
                                  backgroundColor: [
                                      "rgba(0,0,0,0)",
                                      "rgba(0,0,0,0.4)",
                                      "rgba(66, 245, 90, 0.7)"
                                  ]
                              }
                            : {
                                  backgroundColor: [
                                      "rgba(66, 245, 90, 0.7)",
                                      "rgba(0,0,0,0.4)",
                                      "rgba(0,0,0,0)"
                                  ]
                              }
                    }
                    transition={{
                        duration: 2
                    }}>
                    <motion.svg
                        preserveAspectRatio={"xMidYMid"}
                        viewBox={"0 0 63.19 63.19"}
                        height={"20"}
                        width={"20"}>
                        <g>
                            <motion.circle
                                stroke={"#FFFFFF"}
                                strokeWidth={"7"}
                                fill={"transparent"}
                                cx={31.59}
                                cy={31.59}
                                r={24}
                                key={"circle"}
                                initial={
                                    copied ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }
                                }
                                animate={
                                    copied ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
                                }
                                transition={copied ? { delay: 1 } : { delay: 0 }}
                            />
                            <motion.path
                                stroke={"#FFFFFF"}
                                strokeWidth={"7"}
                                strokeLinecap={"round"}
                                fill={"transparent"}
                                d={"M17.29 31.59l10.98 10.42 17.49-18.23"}
                                key={"check"}
                                initial={
                                    copied
                                        ? { opacity: 0, pathLength: 0 }
                                        : { opacity: 1, pathLength: 1 }
                                }
                                animate={
                                    copied
                                        ? { opacity: 1, pathLength: 1 }
                                        : { opacity: 0, pathLength: 0 }
                                }
                                transition={
                                    copied
                                        ? { delay: 1.2, duration: 1 }
                                        : { delay: 0.2, duration: 1 }
                                }
                            />
                        </g>
                    </motion.svg>

                    {/* TODO replace this with clipboard SVG */}
                    <motion.svg
                        preserveAspectRatio={"xMidYMid"}
                        viewBox={"0 0 63.19 63.19"}
                        height={"20"}
                        width={"20"}>
                        <g>
                            <motion.circle
                                stroke={"#FFFFFF"}
                                strokeWidth={"7"}
                                fill={"transparent"}
                                cx={31.59}
                                cy={31.59}
                                r={24}
                                key={"circle"}
                                initial={
                                    copied ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
                                }
                                animate={
                                    copied ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }
                                }
                                transition={copied ? { delay: 0 } : { delay: 1 }}
                            />
                            <motion.path
                                stroke={"#FFFFFF"}
                                strokeWidth={"7"}
                                strokeLinecap={"round"}
                                fill={"transparent"}
                                d={"M17.29 31.59l10.98 10.42 17.49-18.23"}
                                key={"check"}
                                initial={
                                    copied
                                        ? { opacity: 1, pathLength: 1 }
                                        : { opacity: 0, pathLength: 0 }
                                }
                                animate={
                                    copied
                                        ? { opacity: 0, pathLength: 0 }
                                        : { opacity: 1, pathLength: 1 }
                                }
                                transition={
                                    copied
                                        ? { delay: 0.2, duration: 1 }
                                        : { delay: 1.2, duration: 1 }
                                }
                            />
                        </g>
                    </motion.svg>
                </motion.button>
            </div>
        </div>
    )
}

export default ActivityHeader
