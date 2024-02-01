import { useItemDefinition } from "~/hooks/dexie/useItemDefinition"
import Crown from "~/images/icons/Crown"
import Expand from "~/images/icons/Expand"
import SplitHeart from "~/images/icons/SplitHeart"
import Stopwatch from "~/images/icons/Stopwatch"
import Ability from "~/images/icons/destiny2/Ability"
import Ammo from "~/images/icons/destiny2/Ammo"
import Death from "~/images/icons/destiny2/Death"
import Kill from "~/images/icons/destiny2/Kill"
import styles from "~/styles/pages/pgcr.module.css"
import { IPGCREntry } from "../../../types/pgcr"
import PGCRPlayer from "../../../util/destiny/Player"
import { formattedNumber, secondsToHMS } from "../../../util/presentation/formatting"
import { useLocale } from "../../app/LocaleManager"
import { SVGComponent } from "../../reusable/SVG"
import { usePGCRContext } from "../PGCR"
import PlayerStatCell from "./PlayerStatCell"

type PlayerStatCellProps = {
    entry: IPGCREntry
    showWeaponsDetails: () => void
}

const PlayerStatCells = ({ entry, showWeaponsDetails }: PlayerStatCellProps) => {
    const { locale } = useLocale()
    const weapon = useItemDefinition(entry.weapons.first()?.hash ?? 73015)
    const { data: pgcr } = usePGCRContext()
    const stats = entry.stats

    const statsData: {
        icon: SVGComponent
        name: string
        value: number | string
    }[] = [
        {
            icon: Kill,
            name: "Kills",
            value: formattedNumber(stats.kills, locale)
        },
        {
            icon: Death,
            name: "Deaths",
            value: formattedNumber(stats.deaths, locale)
        },
        {
            icon: SplitHeart,
            name: "Assists",
            value: formattedNumber(stats.assists, locale)
        },
        {
            icon: Ability,
            name: "Ability Kills",
            value: formattedNumber(stats.abilityKills, locale)
        },
        {
            icon: Stopwatch,
            name: "Time Spent",
            value: secondsToHMS(stats.timePlayedSeconds)
        },
        {
            icon: Ammo,
            name: "Most Used Weapon",
            value: weapon?.displayProperties.name ?? "None"
        }
    ]

    if (entry instanceof PGCRPlayer) {
        statsData.splice(3, 0, {
            icon: Crown,
            name: "Score",
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
                        Kills Breakdown
                    </span>
                    <span
                        className={[styles["summary-stat-value"], styles["contained-span"]].join(
                            " "
                        )}>
                        Click to View
                    </span>
                </div>
            </div>
        </div>
    )
}

export default PlayerStatCells
