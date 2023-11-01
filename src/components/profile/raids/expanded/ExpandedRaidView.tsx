import { ListedRaid, SunsetRaids } from "~/types/raids"
import styles from "./expanded-raid.module.css"
import { useLocale } from "~/components/app/LocaleManager"
import RaidStats from "~/models/profile/data/RaidStats"
import { secondsToHMS } from "~/util/presentation/formatting"
import { Collection } from "@discordjs/collection"
import Activity from "~/models/profile/data/Activity"
import Link from "next/link"
import WeeklyProgress from "./WeeklyProgress"
import { includedIn } from "~/util/betterIncludes"
import ActivityTile from "../ActivityTile"
import { useMemo } from "react"

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
    const acts = useMemo(
        () =>
            activities
                ?.toJSON()
                .filter(a => a.completed)
                .slice(0, 6),
        [activities]
    )
    return (
        <div className={styles["expanded-raid"]}>
            <button onClick={dismiss}>close</button>
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
            <h2>Expanded details for {strings.raidNames[raid]}</h2>
            <div className={styles["container"]}>
                <div className={styles["bungie-stats"]}>
                    <h3>Bungie Stats</h3>
                    {!isLoadingStats && (
                        <table className={styles["table"]}>
                            <thead>
                                <tr>
                                    <th>Kills</th>
                                    <th>Deaths</th>
                                    <th>Assists</th>
                                    <th>Precision Kills</th>
                                    <th>Time Played</th>
                                    <th>Total Clears</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{stats.kills}</td>
                                    <td>{stats.deaths}</td>
                                    <td>{stats.assists}</td>
                                    <td>{stats.precisionKills}</td>
                                    <td>{secondsToHMS(stats.secondsPlayed, true)}</td>
                                    <td>{stats.totalClears}</td>
                                </tr>
                            </tbody>
                        </table>
                    )}

                    {!includedIn(SunsetRaids, raid) && (
                        <div>
                            <h3>Weekly Progress</h3>
                            <WeeklyProgress raid={raid} />
                        </div>
                    )}
                </div>
                <div className={styles["history"]}>
                    <h3>Recent Completions</h3>
                    {!isLoadingActivities && (
                        <div className={styles["history-activities"]}>
                            {acts?.map(a => (
                                <ActivityTile key={a.activityId} activity={a} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
