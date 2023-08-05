import styles from "../../styles/pages/leaderboards.module.css"
import { RRLeaderboardEntryUser } from "../../services/raidhub/getLeaderboard"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const LeaderboardEntryUser = ({ user }: { user: RRLeaderboardEntryUser }) => {
    const [icon, setIcon] = useState(
        "https://www.bungie.net/common/destiny2_content/icons/" + user.iconPath
    )
    return (
        <div className={styles["leaderboard-entry-user"]}>
            <div className={styles["user-icon-container"]}>
                <Image
                    onError={() =>
                        setIcon("https://www.bungie.net/img/theme/destiny/icons/missing_emblem.jpg")
                    }
                    src={icon}
                    alt={`icon for ${user.displayName}`}
                    fill
                />
            </div>
            <Link
                href={`/profile/${user.membershipType}/${user.membershipId}`}
                className={styles["username"]}>
                <p>{user.bungieGlobalDisplayName ?? user.displayName ?? user.membershipId}</p>
            </Link>
        </div>
    )
}

export default LeaderboardEntryUser
