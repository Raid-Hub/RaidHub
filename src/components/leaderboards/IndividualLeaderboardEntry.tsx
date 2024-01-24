import styles from "~/styles/pages/leaderboards.module.css"
import { useState } from "react"
import { IndividualLeaderboardEntry } from "~/types/leaderboards"
import Link from "next/link"
import { formattedNumber, secondsToHMS } from "~/util/presentation/formatting"
import Image from "next/image"
import { useLocale } from "../app/LocaleManager"

const defautlIcon = "https://www.bungie.net/img/theme/destiny/icons/missing_emblem.jpg"

export const IndividualLeaderboardEntryComponent = ({
    entry,
    valueType
}: {
    entry: IndividualLeaderboardEntry
    isSearched?: boolean
    valueType: "number" | "duration"
}) => {
    const [icon, setIcon] = useState(entry.iconURL ?? defautlIcon)
    const { locale } = useLocale()

    return (
        <div className={styles["individual-leaderboard-entry"]}>
            <div className={styles["individual-leaderboard-entry-rank"]}>{entry.rank}</div>
            <div className={styles["individual-user-icon-container"]}>
                <Image
                    unoptimized
                    onError={() => setIcon(defautlIcon)}
                    src={icon}
                    alt={`icon for ${entry.displayName}`}
                    fill
                />
            </div>
            <Link
                href={entry.url}
                target={entry.url.startsWith("/") ? "" : "_blank"}
                className={styles["individual-username"]}>
                <span>{entry.displayName}</span>
            </Link>
            <span className={styles["individual-value"]}>
                {valueType === "number"
                    ? formattedNumber(entry.value, locale)
                    : secondsToHMS(entry.value, true)}
            </span>
        </div>
    )
}
