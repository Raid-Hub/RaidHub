import styles from "../../styles/pages/pgcr.module.css"
import { formattedNumber, secondsToHMS } from "../../util/presentation/formatting"
import { IPGCREntry } from "../../types/pgcr"
import { useLocale } from "../app/LocaleManager"
import Image, { StaticImageData } from "next/image"
import { Abilities, Assists, Deaths, Kills, MVP, Question_Mark, Time } from "../../images/icons"
import { useWeapon } from "../app/DestinyManifestManager"
import { useMemo } from "react"
import { Collection } from "@discordjs/collection"

type PlayerStatCellProps = {
    entry: IPGCREntry
    weightedScores: Collection<string, number>
}

const PlayerStatCells = ({ entry, weightedScores }: PlayerStatCellProps) => {
    const { locale, strings } = useLocale()
    const weapon = useWeapon(entry.weapons.first()?.hash ?? null)
    const stats = useMemo(() => entry.stats, [entry])

    const statsData: {
        icon: StaticImageData
        name: string
        value: number | string
    }[] = [
        {
            icon: Kills,
            name: strings.kills,
            value: formattedNumber(stats.kills, locale)
        },
        {
            icon: Deaths,
            name: strings.deaths,
            value: formattedNumber(stats.deaths, locale)
        },
        {
            icon: Assists,
            name: strings.assists,
            value: formattedNumber(stats.assists, locale)
        },
        {
            icon: MVP,
            name: strings.score,
            value: formattedNumber(weightedScores.get(entry.membershipId) ?? 0, locale)
        },
        {
            icon: Abilities,
            name: strings.abilityKills,
            value: formattedNumber(stats.abilityKills, locale)
        },
        {
            icon: Time,
            name: strings.timeSpent,
            value: secondsToHMS(stats.timePlayedSeconds)
        },
        {
            icon: Question_Mark,
            name: strings.mostUsedWeapon,
            value: weapon?.name ?? strings.none
        },
        {
            icon: Question_Mark,
            name: strings.allWeapons,
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
