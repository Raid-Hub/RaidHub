import styles from "../../styles/pages/pgcr.module.css"
import { formattedNumber } from "../../util/presentation/formatting"
import { useLocale } from "../app/LocaleManager"
import Image, { StaticImageData } from "next/image"
import { Abilities, Assists, Deaths, Kills, MVP, Question_Mark } from "../../images/icons"
import { useMemo } from "react"
import { usePGCRContext } from "../../pages/pgcr/[activityId]"
import { useItem } from "../app/DestinyManifestManager"

const SummaryStatsGrid = () => {
    const { locale, strings } = useLocale()
    const { data: pgcr } = usePGCRContext()

    const stats = useMemo(() => pgcr?.stats, [pgcr])
    const { data: weapon } = useItem(stats?.mostUsedWeapon?.hash ?? 73015)
    const statsData: {
        icon: StaticImageData
        name: string
        value: number | string
    }[] = [
        ...(pgcr?.completed
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
            name: strings.overallKD,
            value: formattedNumber(stats?.overallKD ?? 0, locale)
        },
        {
            icon: Question_Mark,
            name: strings.superKills,
            value: formattedNumber(stats?.totalSuperKills ?? 0, locale)
        },
        {
            icon: Question_Mark,
            name: strings.totalCharactersUsed,
            value: stats?.totalCharactersUsed ?? 0
        },
        {
            icon: Question_Mark,
            name: strings.mostUsedWeapon,
            value: weapon?.displayProperties.name ?? strings.none
        }
    ]
    return (
        <section className={styles["summary-stats"]}>
            {statsData.map(({ icon, name, value }, idx) => (
                <div key={idx} className={styles["summary-stat"]}>
                    <div className={styles["summary-stat-content"]}>
                        <div className={styles["stat-icon-container"]}>
                            <Image src={icon} alt={name + ": " + value} fill />
                        </div>
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
        </section>
    )
}

export default SummaryStatsGrid
