import { useLanguage } from "../../hooks/language"
import Activity from "../../models/pgcr/Activity"
import styles from "../../styles/pgcr.module.css"
import { formattedNumber } from "../../util/formatting"
import { Icons } from "../../util/icons"
import { LocalizedStrings } from "../../util/localized-strings"

type SummaryStatsProps = {
    activity: Activity | null
}

const SummaryStats = ({ activity }: SummaryStatsProps) => {
    const { language, locale } = useLanguage()
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
            value: formattedNumber(stats?.totalKills ?? 0, locale)
        },
        {
            icon: Icons.DEATHS,
            name: strings.totalDeaths,
            value: formattedNumber(stats?.totalDeaths ?? 0, locale)
        },
        {
            icon: Icons.ASSISTS,
            name: strings.totalAssists,
            value: formattedNumber(stats?.totalAssists ?? 0, locale)
        },
        {
            icon: Icons.ABILITIES,
            name: strings.abilityKillsPercentage,
            value: formattedNumber(stats?.killsTypeRatio.ability ?? 0, locale) + "%"
        },
        {
            icon: Icons.UNKNOWN,
            name: strings.killsPerMinute,
            value: formattedNumber(stats?.killsPerMinute ?? 0, locale)
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
            {statsData.map(({ icon, name, value }, idx) => (
                <div key={idx} className={styles["summary-stat"]}>
                    <div className={styles["summary-stat-content"]}>
                        <img src={icon} alt={name + ": " + value} className={styles["stat-icon"]} />
                        <div className={styles["summary-stat-info"]}>
                            <span
                                className={[
                                    styles["summary-stat-name"],
                                    styles["contained-span"]
                                ].join(" ")}>
                                {name}
                            </span>
                            <span
                                className={[
                                    styles["summary-stat-value"],
                                    styles["contained-span"]
                                ].join(" ")}>
                                {value}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default SummaryStats
