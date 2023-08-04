import styles from "../../styles/pages/leaderboards.module.css"
import { RRLeaderboardEntryUser } from "../../services/raidhub/getLeaderboard"
import Image from "next/image"
import Link from "next/link"

const LeaderboardEntryUser = ({ user }: { user: RRLeaderboardEntryUser }) => {
    return (
        <div className={styles["leaderboard-entry-user"]}>
            <div className={styles["user-icon-container"]}>
                <Image
                    src={"https://www.bungie.net/common/destiny2_content/icons/" + user.iconPath}
                    alt={`icon for ${user.displayName}`}
                    fill
                />
            </div>
            <Link
                href={`/profile/${user.membershipType}/${user.membershipId}`}
                className={styles["username"]}>
                <p>{user.bungieGlobalDisplayName}</p>
            </Link>
        </div>
    )
}

export default LeaderboardEntryUser
