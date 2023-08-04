import styles from "../../styles/pages/pgcr.module.css"
import DestinyPGCR from "../../models/pgcr/PGCR"
import { formattedNumber } from "../../util/presentation/formatting"
import { useLocale } from "../app/LocaleManager"
import Image, { StaticImageData } from "next/image"
import { Abilities, Assists, Deaths, Kills, MVP, Question_Mark } from "../../images/icons"
import { useWeapons } from "../app/DestinyManifestManager"

type SummaryStatsProps = {
    activity: DestinyPGCR | null
}

const SummaryStatsGrid = ({ activity }: SummaryStatsProps) => {
    const { language, locale, strings } = useLocale()
    const weapons = useWeapons()
    const stats = activity?.stats
    const statsData: {
        icon: StaticImageData
        name: string
        value: number | string
    }[] = [
        ...(activity?.completed
            ? [
                  {
                      icon: MVP,
                      name: strings.mvp,
                      value: stats?.mvp ?? "???"
                  }
              ]
            : []),
        {
            icon: Kills,
            name: strings.totalKills,
            value: formattedNumber(stats?.totalKills ?? 0, locale)
        },
        {
            icon: Deaths,
            name: strings.totalDeaths,
            value: formattedNumber(stats?.totalDeaths ?? 0, locale)
        },
        {
            icon: Assists,
            name: strings.totalAssists,
            value: formattedNumber(stats?.totalAssists ?? 0, locale)
        },
        {
            icon: Abilities,
            name: strings.abilityKillsPercentage,
            value: formattedNumber(stats?.totalAbilityKills ?? 0, locale)
        },
        {
            icon: Question_Mark,
            name: strings.killsPerMinute,
            value: formattedNumber(stats?.killsPerMinute ?? 0, locale)
        },
        {
            icon: Question_Mark,
            name: strings.totalCharactersUsed,
            value: stats?.totalCharactersUsed ?? 0
        },
        {
            icon: Question_Mark,
            name: strings.mostUsedWeapon,
            value: stats?.mostUsedWeapon ? weapons[stats.mostUsedWeapon.hash]?.name : strings.none
        }
    ]
    return (
        <>
            {statsData.map(({ icon, name, value }, idx) => (
                <div key={idx} className={styles["summary-stat"]}>
                    <div className={styles["summary-stat-content"]}>
                        <Image
                            src={icon}
                            alt={name + ": " + value}
                            className={styles["stat-icon"]}
                        />
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

export default SummaryStatsGrid
