import { FC } from "react"
import { useLanguage } from "../../hooks/language"
import { Activity } from "../../models/pgcr/Activity"
import styles from "../../styles/pgcr.module.css"
import { Icons } from "../../util/icons"
import { LocalizedStrings } from "../../util/localized-strings"

type SummaryStatsProps = {
    activity: Activity | null
}

const SummaryStats = ({ activity }: SummaryStatsProps) => {
    const language = useLanguage()
    const strings = LocalizedStrings[language]
    const stats = activity?.stats
    const statsData: {
        icon: string
        name: string
        value: number | string
    }[] = [
        {
            icon: Icons.MVP,
            name: strings.mvp,
            value: stats?.mvp ?? "???"
        },
        {
            icon: Icons.KILLS,
            name: strings.totalKills,
            value: stats?.totalKills ?? 0
        },
        {
            icon: Icons.DEATHS,
            name: strings.deaths,
            value: stats?.totalDeaths ?? 0
        },
        {
            icon: Icons.ABILITIES,
            name: strings.abilityKillsPercentage,
            value: (stats?.killsTypeRatio.ability ?? 0) + "%"
        },
        {
            icon: Icons.UNKNOWN,
            name: strings.totalCharactersUsed,
            value: stats?.totalCharactersUsed ?? 0
        },
        {
            icon: Icons.UNKNOWN,
            name: strings.mostUsedWeapon,
            value: stats?.mostUsedWeapon?.name[language] ?? strings.none
        }
    ]
    return (
        <>
            {statsData.map((stat, idx) => (
                <div
                    key={idx}
                    className={[styles["soft-rectangle"], styles["summary-stat"]].join(" ")}
                >
                    <div className={styles["summary-stat-content"]}>
                        <img
                            src={stat.icon}
                            alt={stat.name + ": " + stat.value}
                            className={styles["stat-icon"]}
                        />
                        <div className={styles["summary-stat-info"]}>
                            <span
                                className={[
                                    styles["summary-stat-name"],
                                    styles["contained-span"]
                                ].join(" ")}
                            >
                                {stat.name}
                            </span>
                            <span
                                className={[
                                    styles["summary-stat-value"],
                                    styles["contained-span"]
                                ].join(" ")}
                            >
                                {stat.value}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default SummaryStats
