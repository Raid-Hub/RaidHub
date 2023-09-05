import styles from "../../styles/pages/pgcr.module.css"
import { formattedNumber, secondsToHMS } from "../../util/presentation/formatting"
import { IPGCREntry } from "../../types/pgcr"
import { useLocale } from "../app/LocaleManager"
import Image, { StaticImageData } from "next/image"
import { Abilities, Assists, Deaths, Kills, MVP, Question_Mark, Time } from "../../images/icons"
import { useWeapon } from "../app/DestinyManifestManager"
import { usePGCRContext } from "../../pages/pgcr/[activityId]"
import PlayerStatCell from "./PlayerStatCell"
import PGCRPlayer from "../../models/pgcr/Player"
import { useRouter } from "next/router"

type PlayerStatCellProps = {
    entry: IPGCREntry
    showWeaponsDetails: () => void
}

const PlayerStatCells = ({ entry, showWeaponsDetails }: PlayerStatCellProps) => {
    const { locale, strings } = useLocale()
    const { data: weapon } = useWeapon(entry.weapons.first()?.hash ?? null)
    const { pgcr } = usePGCRContext()
    const router = useRouter()
    const stats = entry.stats

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
        }
    ]

    if (entry instanceof PGCRPlayer) {
        statsData.splice(3, 0, {
            icon: MVP,
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
                <Image
                    src={Question_Mark}
                    width={30}
                    height={30}
                    alt={strings.killBreakdown}
                    className={styles["stat-icon"]}
                />
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
