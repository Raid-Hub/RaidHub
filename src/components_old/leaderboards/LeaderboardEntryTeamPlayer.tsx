"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { LeaderboardEntryPlayer } from "~/app/leaderboards/LeaderboardEntries"
import styles from "./leaderboards.module.css"

const defautlIcon = "https://www.bungie.net/img/theme/destiny/icons/missing_emblem.jpg"

const LeaderboardEntryUser = (player: LeaderboardEntryPlayer) => {
    const [icon, setIcon] = useState(player.iconUrl ?? defautlIcon)

    return (
        <div className={styles["leaderboard-entry-user"]}>
            <div className={styles["user-icon-container"]}>
                <Image
                    unoptimized
                    onError={() => setIcon(defautlIcon)}
                    src={icon}
                    alt={`icon for ${player.displayName}`}
                    fill
                />
            </div>
            {player.url ? (
                <Link
                    href={player.url}
                    className={styles["username"]}
                    target={player.url.startsWith("/") ? "" : "_blank"}>
                    <span>{player.displayName}</span>
                </Link>
            ) : (
                <span className={styles["username"]}>
                    <span>{player.displayName}</span>
                </span>
            )}
        </div>
    )
}

export default LeaderboardEntryUser
