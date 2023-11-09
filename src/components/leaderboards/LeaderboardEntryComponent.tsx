import styles from "../../styles/pages/leaderboards.module.css"
import LeaderboardEntryUser from "./LeaderboardEntryPlayer"
import { secondsToHMS } from "../../util/presentation/formatting"
import Link from "next/link"
import { LeaderboardEntry } from "../../types/leaderboards"

const LeaderboardEntryComponent = ({ entry }: { entry: LeaderboardEntry }) => {
    return (
        <div className={styles["leaderboard-entry"]}>
            <p className={styles["leaderboard-entry-rank"]}>{entry.rank}</p>
            <Link
                href={entry.url}
                className={styles["entry-time-mobile"]}
                target={entry.url.startsWith("/") ? "" : "_blank"}>
                {secondsToHMS(entry.timeInSeconds, true)}
            </Link>
            <div className={styles["leaderboard-entry-users"]}>
                {entry.participants.map(usr => (
                    <LeaderboardEntryUser key={usr.id} user={usr} />
                ))}
            </div>
            <Link
                href={entry.url}
                className={styles["entry-time"]}
                target={entry.url.startsWith("/") ? "" : "_blank"}>
                {secondsToHMS(entry.timeInSeconds, true)}
            </Link>
        </div>
    )
}

export default LeaderboardEntryComponent
