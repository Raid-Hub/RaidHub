import { useLanguage } from "../../hooks/language"
import { Icons } from "../../util/icons"
import styles from "../../styles/pgcr.module.css"
import { LocalizedStrings } from "../../util/localized-strings"
import PGCREntry from "../../models/pgcr/Entry"
import { formattedNumber } from "../../util/formatting"

type PlayerStatCardProps = {
    entry: PGCREntry
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
            value: entry.stats.timePlayed
        },
        {
            icon: Icons.UNKNOWN,
            name: strings.mostUsedWeapon,
            value: entry.stats.weapons.first()?.name[language] ?? strings.none
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
