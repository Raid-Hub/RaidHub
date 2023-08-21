import styles from "../../styles/pages/pgcr.module.css"
import { formattedNumber, secondsToHMS } from "../../util/presentation/formatting"
import { IPGCREntry } from "../../types/pgcr"
import { useLocale } from "../app/LocaleManager"
import { StaticImageData } from "next/image"
import { Abilities, Assists, Deaths, Kills, MVP, Question_Mark, Time } from "../../images/icons"
import { useWeapon } from "../app/DestinyManifestManager"
import { useMemo } from "react"
import { usePGCRContext } from "../../pages/pgcr/[activityId]"
import PlayerStatCell from "./PlayerStatCell"

type PlayerStatCellProps = {
    entry: IPGCREntry
}

const PlayerStatCells = ({ entry }: PlayerStatCellProps) => {
    const { locale, strings } = useLocale()
    const { data: weapon } = useWeapon(entry.weapons.first()?.hash ?? null)
    const stats = useMemo(() => entry.stats, [entry])
    const { pgcr } = usePGCRContext()

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
            value: formattedNumber(pgcr?.weightedScores.get(entry.membershipId) ?? 0, locale)
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

    return (
        <div className={styles["grid"]}>
            {statsData.map((data, key) => (
                <PlayerStatCell {...data} key={key} />
            ))}
            <div>
                <PlayerStatCell icon={Question_Mark} name={strings.allWeapons} value={"IDK"} />
            </div>
        </div>
    )
}

export default PlayerStatCells
