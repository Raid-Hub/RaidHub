import styles from "../../styles/pages/leaderboards.module.css"
import { RRLeaderboardEntry } from "../../services/raidhub/getLeaderboard"
import LeaderboardEntryUser from "./LeaderboardEntryPlayer"
import { secondsToHMS } from "../../util/presentation/formatting"
import Link from "next/link"

const LeaderboardEntry = ({ entry, rank }: { entry: RRLeaderboardEntry; rank: number }) => {
    return (
        <div className={styles["leaderboard-entry"]}>
            <p className={styles["leaderboard-entry-rank"]}>{rank}</p>
            <div className={styles["leaderboard-entry-users"]}>
                {entry.destinyUserInfos.map(usr => (
                    <LeaderboardEntryUser key={usr.membershipId} user={usr} />
                ))}
            </div>
            <Link
                href={`/pgcr/${entry.activityDetails.instanceId}`}
                className={styles["entry-time"]}>
                {secondsToHMS(entry.value, true)}
            </Link>
        </div>
    )
}

export default LeaderboardEntry
