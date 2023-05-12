import React, { useState } from 'react';
import Link from "next/link"
import styles from "../../styles/profile.module.css"
import { Raid, RaidCardBackground } from "../../util/raid"
import DotGraph from "./DotGraph"
import { secondsToHMS } from "../../util/formatting"
import { DestinyHistoricalStatsPeriodGroup } from "bungie-net-core/lib/models"
import { Icons } from "../../util/icons"
import RaidStats from "../../models/profile/RaidStats"
import Loading from "../Loading"
import { usePrefs } from "../../hooks/prefs"
import { Prefs } from "../../util/preferences"
import { Placement, RaidTag } from "../../util/types"
import { formattedNumber } from "../../util/formatting"
import { useLanguage } from "../../hooks/language"

type RaidModalProps = {
    placement: Placement | undefined
    tags: RaidTag[] | undefined
    membershipId: string
    raid: Raid
    raidName: string
    activities: DestinyHistoricalStatsPeriodGroup[]
    stats: RaidStats | undefined
    isLoadingDots: boolean
    isLoadingStats: boolean
}

const RaidModal = ({
    placement,
    tags,
    membershipId,
    raid,
    raidName,
    activities,
    stats,
    isLoadingDots,
    isLoadingStats
}: RaidModalProps) => {
    const { locale } = useLanguage()
    const { isLoading: isLoadingPrefs, prefs } = usePrefs(membershipId, [Prefs.FILTER])
    const [showDiv, setShowDiv] = useState(false);
    const [activityDurationSeconds, setActivityDurationSeconds] = useState(0);
    const [divPosition, setDivPosition] = useState({});
    return (
        <div className={styles["raid-card"]}>
            <div className={styles["raid-card-img-container"]}>
                <img className={styles["top-image"]} src={RaidCardBackground[raid]} alt="" />
                <div className={styles["img-overlay"]}>
                    <div className={styles["tag-row"]}>
                        {placement && (
                            <Link
                                href={`/pgcr/${placement.activityId}`}
                                className={styles["clickable-tag"]}>
                                <span>{`Day One #${placement.number}`}</span>
                            </Link>
                        )}
                    </div>
                    <div className={styles["img-overlay-bottom"]}>
                        <div className={styles["card-diamonds"]}>
                            {tags?.map(({ activityId, string, flawless }, key) => (
                                <Link
                                    key={key}
                                    href={`/pgcr/${activityId}`}
                                    className={styles["clickable-tag"]}>
                                    {flawless && <img src={Icons.FLAWLESS_DIAMOND} alt="" />}
                                    <span>{string}</span>
                                </Link>
                            ))}
                        </div>
                        <span className={styles["raid-card-title"]}>{raidName}</span>
                    </div>
                </div>
            </div>
            <div className={styles["raid-card-content"]}>
                <div className={styles["graph-content"]}>
                    <DotGraph
                        divPosition={divPosition}
                        setDivPosition={setDivPosition}
                        showDiv={showDiv}
                        setShowDiv={setShowDiv}
                        dots={activities.filter(prefs?.[Prefs.FILTER] ?? (() => true))}
                        isLoading={isLoadingDots}
                        setActivityDurationSeconds={setActivityDurationSeconds}
                    />
                    <div className={styles["graph-count"]}>
                        <div className={styles["graph-number-img"]}>
                            {!isLoadingStats && stats ? (
                                <p className={styles["graph-number"]}>
                                    {formattedNumber(stats.totalClears, locale)}
                                </p>
                            ) : (
                                <div className={styles["number-loading"]}>
                                    <Loading />
                                </div>
                            )}
                        </div>
                        <p className={styles["graph-count-text"]}>
                            total
                            <br /> clears
                        </p>
                    </div>
                </div>

                <div className={styles["timings"]}>
                    <div className={styles["timing"]}>
                        {!isLoadingStats && stats ? (
                            <p className={styles["timings-number"]}>
                                {secondsToHMS(stats.fastestClear / 1000)}
                            </p>
                        ) : (
                            <div className={styles["number-loading"]}>
                                <Loading />
                            </div>
                        )}
                        <p className={styles["timings-subtitle"]}>fastest</p>
                    </div>

                    <div className={styles["timing"]}>
                        {!isLoadingStats && stats ? (
                            <p className={styles["timings-number"]}>
                                {secondsToHMS(stats.averageClear)}
                            </p>
                        ) : (
                            <div className={styles["number-loading"]}>
                                <Loading />
                            </div>
                        )}
                        <p className={styles["timings-subtitle"]}>Average</p>
                    </div>

                    <div className={styles["timing"]}>
                        {!isLoadingStats && stats ? (
                            <p className={styles["timings-number"]}>{stats.sherpas}</p>
                        ) : (
                            <div className={styles["number-loading"]}>
                                <Loading />
                            </div>
                        )}
                        <p className={styles["timings-subtitle"]}>Sherpas</p>
                    </div>
                </div>
            </div>
            {showDiv && <div className={styles["tooltip"]} style={{ position: 'absolute', top: divPosition.top, left: divPosition.left }}>
                <div className={styles["tooltip-content"]}>
                    <div className={styles["tooltip-top"]}>
                        <p><i className={`${styles["error-color"]} material-icons`} style={{ fontSize: 10 }}>cancel</i> {formatTime(activityDurationSeconds)}</p>
                    </div>
                    <div className={styles["tooltip-bottom"]}>
                        <p><small> (10m ago)</small></p>
                    </div>
                </div>
            </div>}
        </div>
    )
}

function formatTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = seconds % 60;
  
    // Add leading zero to single digit values
    const formattedHours = hours.toString();
    const formattedMinutes = minutes.toString();
    const formattedSeconds = secondsLeft.toString();
  
    if (hours != 0) {
        return `${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`;
    }
    return `${formattedMinutes}m ${formattedSeconds}s`;
  }
export default RaidModal
