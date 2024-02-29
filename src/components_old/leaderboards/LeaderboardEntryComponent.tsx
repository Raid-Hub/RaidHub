"use client"

import Link from "next/link"
import { LeaderboardEntry } from "~/app/leaderboards/LeaderboardEntries"
import { useLocale } from "~/layout/managers/LocaleManager"
import { formattedNumber, secondsToHMS, truncatedNumber } from "../../util/presentation/formatting"
import LeaderboardEntryUser from "./LeaderboardEntryTeamPlayer"
import styles from "./leaderboards.module.css"

/** @deprecated */
const LeaderboardEntryComponent = ({
    format,
    ...entry
}: LeaderboardEntry & {
    format: "time" | "number"
}) => {
    const { locale } = useLocale()
    const value =
        format === "time" ? secondsToHMS(entry.value, true) : formattedNumber(entry.value, locale)

    return (
        <div className={styles["leaderboard-entry"]}>
            <p className={styles["leaderboard-entry-rank"]}>{truncatedNumber(entry.rank)}</p>
            {entry.url ? (
                <Link
                    href={entry.url}
                    className={styles["entry-time-mobile"]}
                    target={entry.url.startsWith("/") ? "" : "_blank"}>
                    {value}
                </Link>
            ) : (
                <p className={styles["entry-time-mobile"]}>{value}</p>
            )}
            {entry.type === "team" ? (
                <div className={styles["leaderboard-entry-users"]}>
                    {entry.team.map(player => (
                        <LeaderboardEntryUser key={player.id} {...player} />
                    ))}
                </div>
            ) : (
                <>{"todo"}</>
            )}
            {entry.url ? (
                <Link
                    href={entry.url}
                    className={styles["entry-time"]}
                    target={entry.url.startsWith("/") ? "" : "_blank"}>
                    {value}
                </Link>
            ) : (
                <p className={styles["entry-time"]}>{value}</p>
            )}
        </div>
    )
}

export default LeaderboardEntryComponent
