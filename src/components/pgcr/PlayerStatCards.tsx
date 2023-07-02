import { useLanguage } from "../../hooks/util/useLanguage"
import { Icons } from "../../util/presentation/icons"
import styles from "../../styles/pgcr.module.css"
import { LocalizedStrings } from "../../util/presentation/localized-strings"
import { formattedNumber } from "../../util/presentation/formatting"
import { IPGCREntry } from "../../types/pgcr"

type PlayerStatCardProps = {
    entry: IPGCREntry
}

const PlayerStatCards = ({ entry }: PlayerStatCardProps) => {
    const { language, locale } = useLanguage()
    const strings = LocalizedStrings[language]
    const statsData: {
        icon: string
        name: string
        value: number | string
    }[] = [
        {
            icon: Icons.KILLS,
            name: strings.kills,
            value: formattedNumber(entry.stats.kills, locale)
        },
        {
            icon: Icons.DEATHS,
            name: strings.deaths,
            value: formattedNumber(entry.stats.deaths, locale)
        },
        {
            icon: Icons.ASSISTS,
            name: strings.assists,
            value: formattedNumber(entry.stats.assists, locale)
        },
        {
            icon: Icons.ABILITIES,
            name: strings.abilityKills,
            value: formattedNumber(entry.stats.abilityKills, locale)
        },
        {
            icon: Icons.TIME,
            name: strings.timeSpent,
            value: entry.stats.timePlayedSeconds
        },
        {
            icon: Icons.UNKNOWN,
            name: strings.mostUsedWeapon,
            value: entry.weapons.first()?.name[language] ?? strings.none
        }
    ]
    return (
        <>
            {statsData.map(({ value, name, icon }, key) => (
                <div
                    key={key}
                    className={[styles["entry-card"], styles["character-stat"]].join(" ")}>
                    <img src={icon} alt={name + ": " + value} className={styles["stat-icon"]} />
                    <div className={styles["summary-stat-info"]}>
                        <span
                            className={[styles["summary-stat-name"], styles["contained-span"]].join(
                                " "
                            )}>
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
            ))}
        </>
    )
}

export default PlayerStatCards
