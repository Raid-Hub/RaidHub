import styles from "../../styles/pages/pgcr.module.css"
import { formattedNumber, secondsToHMS } from "../../util/presentation/formatting"
import { IPGCREntry } from "../../types/pgcr"
import { useLocale } from "../app/LocaleManager"
import Image, { StaticImageData } from "next/image"
import { Abilities, Assists, Deaths, Kills, Question_Mark, Time } from "../../images/icons"
import { useWeapon } from "../app/DestinyManifestManager"

type PlayerStatCellProps = {
    entry: IPGCREntry
}

const PlayerStatCells = ({ entry }: PlayerStatCellProps) => {
    const { locale, strings } = useLocale()
    const weapon = useWeapon(entry.weapons.first()?.hash ?? null)
    const statsData: {
        icon: StaticImageData
        name: string
        value: number | string
    }[] = [
        {
            icon: Kills,
            name: strings.kills,
            value: formattedNumber(entry.stats.kills, locale)
        },
        {
            icon: Deaths,
            name: strings.deaths,
            value: formattedNumber(entry.stats.deaths, locale)
        },
        {
            icon: Assists,
            name: strings.assists,
            value: formattedNumber(entry.stats.assists, locale)
        },
        {
            icon: Abilities,
            name: strings.abilityKills,
            value: formattedNumber(entry.stats.abilityKills, locale)
        },
        {
            icon: Time,
            name: strings.timeSpent,
            value: secondsToHMS(entry.stats.timePlayedSeconds)
        },
        {
            icon: Question_Mark,
            name: strings.mostUsedWeapon,
            value: weapon?.name ?? strings.none
        }
    ]

    return (
        <>
            {statsData.map(({ value, name, icon }, key) => (
                <div
                    key={key}
                    className={[styles["entry-card"], styles["character-stat"]].join(" ")}>
                    <Image src={icon} alt={name + ": " + value} className={styles["stat-icon"]} />
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

export default PlayerStatCells
