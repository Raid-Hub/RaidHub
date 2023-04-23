import Link from "next/link"
import styles from "../../styles/profile.module.css"
import { Raid, RaidCardBackground } from "../../util/raid"
import DotGraph from "./DotGraph"
import { secondsToHMS } from "../../util/math"
import { DestinyHistoricalStatsPeriodGroup } from "bungie-net-core/lib/models"
import { Icons } from "../../util/icons"
import RaidStats from "../../models/profile/RaidStats"
import Loading from "../Loading"
import { usePrefs } from "../../hooks/prefs"
import { Prefs } from "../../util/preferences"
import { Placement, RaidTag } from "../../util/types"

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
    const { isLoading: isLoadingPrefs, prefs } = usePrefs(membershipId, [Prefs.FILTER])
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
                            {tags?.map(({ activityId, string, flawless }) => (
                                <Link
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
                        dots={activities.filter(prefs?.[Prefs.FILTER] ?? (() => true))}
                        isLoading={isLoadingDots}
                    />
                    <div className={styles["graph-count"]}>
                        <div className={styles["graph-number-img"]}>
                            {!isLoadingStats && stats ? (
                                <p className={styles["graph-number"]}>{stats.totalClears}</p>
                            ) : (
                                <div className={styles["number-loading"]}>
                                    <Loading />
                                </div>
                            )}
                        </div>
                        <p className={styles["graph-count-text"]}>total clears</p>
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
        </div>
    )
}

export default RaidModal
