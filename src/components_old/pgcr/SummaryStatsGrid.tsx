"use client"

import { usePGCRContext } from "~/app/pgcr/PGCRStateManager"
import { type SVGComponent } from "~/components/SVG"
import Ability from "~/components/icons/Ability"
import Ammo from "~/components/icons/Ammo"
import Assist from "~/components/icons/Assist"
import Crosshairs from "~/components/icons/Crosshairs"
import Crown from "~/components/icons/Crown"
import Death from "~/components/icons/Death"
import Intellect from "~/components/icons/Intellect"
import Kill from "~/components/icons/Kill"
import Users from "~/components/icons/Users"
import { useItemDefinition } from "~/hooks/dexie"
import { useRaidHubResolvePlayer } from "~/services/raidhub/hooks"
import type { RaidHubPlayerBasicResponse } from "~/services/raidhub/types"
import { getBungieDisplayName } from "~/util/destiny/getBungieDisplayName"
import { useLocale } from "../../app/layout/managers/LocaleManager"
import { formattedNumber } from "../../util/presentation/formatting"
import styles from ".//pgcr.module.css"

/** @deprecated */
const SummaryStatsGrid = () => {
    const { locale } = useLocale()
    const { stats, completed } = usePGCRContext()

    const weapon = useItemDefinition(stats?.mostUsedWeaponHash ?? 73015)
    const mvp = stats?.mvp?.firstCharacter().destinyUserInfo

    const { data: resolvedPlayer } = useRaidHubResolvePlayer(stats?.mvp?.membershipId ?? "0", {
        enabled: !!stats?.mvp && !stats.mvp.membershipType,
        placeholderData: stats?.mvp
            ? ({
                  membershipId: stats.mvp.membershipId,
                  displayName: stats.mvp.characters.first()?.destinyUserInfo.displayName,
                  bungieGlobalDisplayName:
                      stats.mvp.characters.first()?.destinyUserInfo.bungieGlobalDisplayName ?? null,
                  bungieGlobalDisplayNameCode: "foo"
              } as RaidHubPlayerBasicResponse)
            : undefined
    })

    const statsData: {
        Icon: SVGComponent
        name: string
        value: number | string
    }[] = [
        ...(completed
            ? [
                  {
                      Icon: Crown,
                      name: "MVP",
                      value: mvp
                          ? getBungieDisplayName(resolvedPlayer!, { excludeCode: true })
                          : "???"
                  }
              ]
            : []),
        {
            Icon: Kill,
            name: "Total Kills",
            value: formattedNumber(stats?.kills ?? 0, locale)
        },
        {
            Icon: Death,
            name: "Total Deaths",
            value: formattedNumber(stats?.deaths ?? 0, locale)
        },
        {
            Icon: Assist,
            name: "Total Assists",
            value: formattedNumber(stats?.assists ?? 0, locale)
        },
        {
            Icon: Ability,
            name: "Ability Kills",
            value: formattedNumber(stats?.abilityKills ?? 0, locale)
        },
        {
            Icon: Crosshairs,
            name: "Overal K/D",
            value: formattedNumber(stats?.overallKD ?? 0, locale)
        },
        {
            Icon: Intellect,
            name: "Super Kills",
            value: formattedNumber(stats?.superKills ?? 0, locale)
        },
        {
            Icon: Users,
            name: "Characters Used",
            value: stats?.charactersUsed ?? 0
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
