import { ListedRaid } from "~/types/raids"
import styles from "./expanded-raid.module.css"
import { useLocale } from "~/components/app/LocaleManager"
import RaidStats from "~/models/profile/data/RaidStats"
import { secondsToHMS, toCustomDateString } from "~/util/presentation/formatting"
import { Collection } from "@discordjs/collection"
import Activity from "~/models/profile/data/Activity"
import Link from "next/link"

type StatsProps =
    | {
          stats: RaidStats
          isLoadingStats: false
      }
    | {
          stats: undefined
          isLoadingStats: true
      }
type ActivitiesProps =
    | {
          activities: Collection<string, Activity>
          isLoadingActivities: false
      }
    | {
          activities: undefined
          isLoadingActivities: true
      }

export default function ExpandedRaidView({
    raid,
    stats,
    isLoadingStats,
    activities,
    isLoadingActivities,
    dismiss
}: {
    raid: ListedRaid
    dismiss: () => void
} & StatsProps &
    ActivitiesProps) {
    const { strings, locale } = useLocale()
    return (
        <div className={styles["expanded-raid"]}>
            <button onClick={dismiss}>close</button>
            <h2>Expanded details for {strings.raidNames[raid]}</h2>
            <div className={styles["container"]}>
                <div className={styles["bungie-stats"]}>
                    <h3>Bungie Stats</h3>
                    {!isLoadingStats && (
                        <table className={styles["table"]}>
                            <tr>
                                <th>Kills</th>
                                <th>Deaths</th>
                                <th>Assists</th>
                                <th>Precision Kills</th>
                                <th>Time Played</th>
                                <th>Total Clears</th>
                            </tr>
                            <tr>
                                <td>{stats.kills}</td>
                                <td>{stats.deaths}</td>
                                <td>{stats.assists}</td>
                                <td>{stats.precisionKills}</td>
                                <td>{secondsToHMS(stats.secondsPlayed, true)}</td>
                                <td>{stats.totalClears}</td>
                            </tr>
                        </table>
                    )}
                </div>
                <div className={styles["history"]}>
                    <h3>History</h3>
                    {!isLoadingActivities && (
                        <div className={styles["history-activities"]}>
                            {activities.map(a => (
                                <Link
                                    key={a.instanceId}
                                    href={`/pgcr/${a.instanceId}`}
                                    className={styles["activity"]}>
                                    <h5>{toCustomDateString(a.endDate, locale)}</h5>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <p>
                This view is still a work in progress. <b>Have an idea or suggestion?</b> Join our
                discord:{" "}
                <Link
                    href="https://discord.gg/raidhub"
                    style={{ color: "var(--brand-orange-light)" }}
                    target="_blank">
                    discord.gg/raidhub
                </Link>
            </p>
        </div>
    )
}
