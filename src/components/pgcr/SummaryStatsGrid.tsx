import { useMemo } from "react"
import { useItemDefinition } from "~/hooks/dexie/useItemDefinition"
import Crosshairs from "~/images/icons/Crosshairs"
import Crown from "~/images/icons/Crown"
import SplitHeart from "~/images/icons/SplitHeart"
import Users from "~/images/icons/Users"
import Ability from "~/images/icons/destiny2/Ability"
import Ammo from "~/images/icons/destiny2/Ammo"
import Death from "~/images/icons/destiny2/Death"
import Intellect from "~/images/icons/destiny2/Intellect"
import Kill from "~/images/icons/destiny2/Kill"
import styles from "../../styles/pages/pgcr.module.css"
import { formattedNumber } from "../../util/presentation/formatting"
import { useLocale } from "../app/LocaleManager"
import { SVGComponent } from "../reusable/SVG"
import { usePGCRContext } from "./PGCR"

const SummaryStatsGrid = () => {
    const { locale } = useLocale()
    const { data: pgcr } = usePGCRContext()

    const stats = useMemo(() => pgcr?.stats, [pgcr])
    const weapon = useItemDefinition(stats?.mostUsedWeapon ?? 73015)
    const statsData: {
        Icon: SVGComponent
        name: string
        value: number | string
    }[] = [
        ...(pgcr?.completed
            ? [
                  {
                      Icon: Crown,
                      name: "MVP",
                      value: stats?.mvp ?? "???"
                  }
              ]
            : []),
        {
            Icon: Kill,
            name: "Total Kills",
            value: formattedNumber(stats?.totalKills ?? 0, locale)
        },
        {
            Icon: Death,
            name: "Total Deaths",
            value: formattedNumber(stats?.totalDeaths ?? 0, locale)
        },
        {
            Icon: SplitHeart,
            name: "Total Assists",
            value: formattedNumber(stats?.totalAssists ?? 0, locale)
        },
        {
            Icon: Ability,
            name: "Ability Kills",
            value: formattedNumber(stats?.totalAbilityKills ?? 0, locale)
        },
        {
            Icon: Crosshairs,
            name: "Overal K/D",
            value: formattedNumber(stats?.overallKD ?? 0, locale)
        },
        {
            Icon: Intellect,
            name: "Super Kills",
            value: formattedNumber(stats?.totalSuperKills ?? 0, locale)
        },
        {
            Icon: Users,
            name: "Characters Used",
            value: stats?.totalCharactersUsed ?? 0
        },
        {
            Icon: Ammo,
            name: "Mosted Used Weapon",
            value: weapon?.displayProperties.name ?? "None"
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
