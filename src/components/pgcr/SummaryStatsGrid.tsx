import styles from "../../styles/pages/pgcr.module.css"
import { formattedNumber } from "../../util/presentation/formatting"
import { useLocale } from "../app/LocaleManager"
import { useMemo } from "react"
import { usePGCRContext } from "../../pages/pgcr/[activityId]"
import { useItem } from "../app/DestinyManifestManager"
import { SVGComponent } from "../reusable/SVG"
import SplitHeart from "~/images/icons/SplitHeart"
import Death from "~/images/icons/destiny2/Death"
import Crown from "~/images/icons/Crown"
import Kill from "~/images/icons/destiny2/Kill"
import Ability from "~/images/icons/destiny2/Ability"
import Intellect from "~/images/icons/destiny2/Intellect"
import Ammo from "~/images/icons/destiny2/Ammo"
import Users from "~/images/icons/Users"
import Crosshairs from "~/images/icons/Crosshairs"

const SummaryStatsGrid = () => {
    const { locale, strings } = useLocale()
    const { data: pgcr } = usePGCRContext()

    const stats = useMemo(() => pgcr?.stats, [pgcr])
    const { data: weapon } = useItem(stats?.mostUsedWeapon?.hash ?? 73015)
    const statsData: {
        Icon: SVGComponent
        name: string
        value: number | string
    }[] = [
        ...(pgcr?.completed
            ? [
                  {
                      Icon: Crown,
                      name: strings.mvp,
                      value: stats?.mvp ?? "???"
                  }
              ]
            : []),
        {
            Icon: Kill,
            name: strings.totalKills,
            value: formattedNumber(stats?.totalKills ?? 0, locale)
        },
        {
            Icon: Death,
            name: strings.totalDeaths,
            value: formattedNumber(stats?.totalDeaths ?? 0, locale)
        },
        {
            Icon: SplitHeart,
            name: strings.totalAssists,
            value: formattedNumber(stats?.totalAssists ?? 0, locale)
        },
        {
            Icon: Ability,
            name: strings.abilityKillsPercentage,
            value: formattedNumber(stats?.totalAbilityKills ?? 0, locale)
        },
        {
            Icon: Crosshairs,
            name: strings.overallKD,
            value: formattedNumber(stats?.overallKD ?? 0, locale)
        },
        {
            Icon: Intellect,
            name: strings.superKills,
            value: formattedNumber(stats?.totalSuperKills ?? 0, locale)
        },
        {
            Icon: Users,
            name: strings.totalCharactersUsed,
            value: stats?.totalCharactersUsed ?? 0
        },
        {
            Icon: Ammo,
            name: strings.mostUsedWeapon,
            value: weapon?.displayProperties.name ?? strings.none
        }
    ]
    return (
        <section className={styles["summary-stats"]}>
            {statsData.map(({ Icon, name, value }, idx) => (
                <div key={idx} className={styles["summary-stat"]}>
                    <div className={styles["summary-stat-content"]}>
                        <div className={styles["stat-icon-container"]}>
                            <Icon sx={40} color="white" />
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
