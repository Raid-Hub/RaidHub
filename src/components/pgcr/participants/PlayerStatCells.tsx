import styles from "~/styles/pages/pgcr.module.css"
import { formattedNumber, secondsToHMS } from "../../../util/presentation/formatting"
import { IPGCREntry } from "../../../types/pgcr"
import { useLocale } from "../../app/LocaleManager"
import { usePGCRContext } from "../PGCR"
import PlayerStatCell from "./PlayerStatCell"
import PGCRPlayer from "../../../models/pgcr/Player"
import { useItem } from "../../app/DestinyManifestManager"
import { SVGComponent } from "../../reusable/SVG"
import Stopwatch from "~/images/icons/Stopwatch"
import SplitHeart from "~/images/icons/SplitHeart"
import Death from "~/images/icons/destiny2/Death"
import Crown from "~/images/icons/Crown"
import Kill from "~/images/icons/destiny2/Kill"
import Ability from "~/images/icons/destiny2/Ability"
import Ammo from "~/images/icons/destiny2/Ammo"
import Expand from "~/images/icons/Expand"

type PlayerStatCellProps = {
    entry: IPGCREntry
    showWeaponsDetails: () => void
}

const PlayerStatCells = ({ entry, showWeaponsDetails }: PlayerStatCellProps) => {
    const { locale, strings } = useLocale()
    const { data: weapon } = useItem(entry.weapons.first()?.hash ?? 73015)
    const { data: pgcr } = usePGCRContext()
    const stats = entry.stats

    const statsData: {
        icon: SVGComponent
        name: string
        value: number | string
    }[] = [
        {
            icon: Kill,
            name: strings.kills,
            value: formattedNumber(stats.kills, locale)
        },
        {
            icon: Death,
            name: strings.deaths,
            value: formattedNumber(stats.deaths, locale)
        },
        {
            icon: SplitHeart,
            name: strings.assists,
            value: formattedNumber(stats.assists, locale)
        },
        {
            icon: Ability,
            name: strings.abilityKills,
            value: formattedNumber(stats.abilityKills, locale)
        },
        {
            icon: Stopwatch,
            name: strings.timeSpent,
            value: secondsToHMS(stats.timePlayedSeconds)
        },
        {
            icon: Ammo,
            name: strings.mostUsedWeapon,
            value: weapon?.displayProperties.name ?? strings.none
        }
    ]

    if (entry instanceof PGCRPlayer) {
        statsData.splice(3, 0, {
            icon: Crown,
            name: strings.score,
            value: formattedNumber(pgcr?.weightedScores.get(entry.membershipId) ?? 0, locale)
        })
    }

    return (
        <div className={styles["grid"]}>
            {statsData.map((data, key) => (
                <PlayerStatCell {...data} key={key} />
            ))}
            <div
                className={[styles["entry-card"], styles["character-stat"]].join(" ")}
                style={{ cursor: "pointer" }}
                onClick={showWeaponsDetails}>
                <div className={styles["stat-icon-container"]}>
                    <Expand color="white" />
                </div>
                <div className={styles["summary-stat-info"]}>
                    <span
                        className={[styles["summary-stat-name"], styles["contained-span"]].join(
                            " "
                        )}>
                        {strings.killBreakdown}
                    </span>
                    <span
                        className={[styles["summary-stat-value"], styles["contained-span"]].join(
                            " "
                        )}>
                        {strings.clickToView}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default PlayerStatCells
