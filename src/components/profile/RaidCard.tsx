import Link from "next/link"
import styles from "../../styles/profile.module.css"
import { Raid, RaidCardBackground } from "../../util/raid"
import DotGraph from "./DotGraph"
import { secondsToHMS } from "../../util/math"
import { DestinyHistoricalStatsPeriodGroup } from "oodestiny/schemas"
import { Icons } from "../../util/icons"

type RaidStats = {
    totalClears: number
    fastestClear: number
    averageClear: number
    sherpas: number
}

type RaidCardProps = {
    raid: Raid
    raidName: string
    activities: DestinyHistoricalStatsPeriodGroup[]
    stats: RaidStats
    isLoadingDots: boolean
}

const RaidCard = ({ raid, raidName, activities, stats, isLoadingDots }: RaidCardProps) => {
    return (
        <div className={styles["raid-card"]}>
            <div className={styles["raid-card-img-container"]}>
                <img className={styles["top-image"]} src={RaidCardBackground[raid]} alt="" />
                <div className={styles["img-overlay"]}>
                    <div className={styles["tag-row"]}>
                        <Link href="/" className={styles["clickable-tag"]}>
                            <span>Day One #1</span>
                        </Link>
                    </div>
                    <div className={styles["img-overlay-bottom"]}>
                        <span className={styles["raid-card-title"]}>{raidName}</span>
                        <div className={styles["card-diamonds"]}>
                            <Link href="/" className={styles["clickable-tag"]}>
                                <img src={Icons.FLAWLESS_DIAMOND} alt="" />
                                <span>Trio Flawless</span>
                            </Link>
                            <Link href="/" className={styles["clickable-tag"]}>
                                <span>Duo Master</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles["raid-card-content"]}>
                <div className={styles["graph-content"]}>
                    <DotGraph
                        dots={activities}
                        isLoading={isLoadingDots}
                        filter={() => true /** (dot) => dot.values.completed.basic.value */}
                    />
                    <div className={styles["graph-count"]}>
                        <div className={styles["graph-number-img"]}>
                            <p className={styles["graph-number"]}>{stats.totalClears}</p>
                        </div>

                        <p className={styles["graph-count-text"]}>total clears</p>
                    </div>
                </div>

                <div className={styles["timings"]}>
                    <div className={styles["timing"]}>
                        <p className={styles["timings-number"]}>
                            {secondsToHMS(stats.fastestClear)}
                        </p>
                        <p className={styles["timings-subtitle"]}>fastest</p>
                    </div>

                    <div className={styles["timing"]}>
                        <p className={styles["timings-number"]}>
                            {secondsToHMS(stats.averageClear)}
                        </p>
                        <p className={styles["timings-subtitle"]}>Average</p>
                    </div>

                    <div className={styles["timing"]}>
                        <p className={styles["timings-number"]}>{stats.sherpas}</p>
                        <p className={styles["timings-subtitle"]}>Sherpas</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RaidCard
