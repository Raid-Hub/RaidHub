import Image, { StaticImageData } from "next/image"
import { Question_Mark } from "../../images/icons"
import styles from "../../styles/pages/pgcr.module.css"
import { IPGCREntry, WeaponStatsValues } from "../../types/pgcr"
import { useWeapon } from "../app/DestinyManifestManager"
import Link from "next/link"
import StyledButton from "../reusable/StyledButton"
import { useLocale } from "../app/LocaleManager"

type AbilityData = {
    name: string
    value: number
    icon: StaticImageData
}
const AllWeapons = ({ entry, back }: { entry: IPGCREntry; back: () => void }) => {
    const { strings } = useLocale()
    const abilityCellData: AbilityData[] = [
        {
            name: strings.super,
            value: entry.stats.superKills,
            icon: Question_Mark
        },
        { name: strings.grenade, value: entry.stats.grenadeKills, icon: Question_Mark },
        { name: strings.melee, value: entry.stats.meleeKills, icon: Question_Mark }
    ]

    const allCellData = [...Array.from(entry.weapons.entries()), ...abilityCellData].sort(
        (a, b) => {
            const aKills = Array.isArray(a) ? a[1].kills : a.value
            const bKills = Array.isArray(b) ? b[1].kills : b.value
            return bKills - aKills
        }
    )
    return (
        <>
            <StyledButton onClick={back} style={{ marginTop: "1em" }}>
                done
            </StyledButton>
            <div className={styles["grid"]}>
                {allCellData.map((datum, idx) =>
                    Array.isArray(datum) ? (
                        <WeaponCell key={idx} hash={datum[0]} stats={datum[1]} />
                    ) : (
                        <AbilityCell key={idx} {...datum} />
                    )
                )}
            </div>
        </>
    )
}

const WeaponCell = ({ hash, stats }: { hash: number; stats: WeaponStatsValues }) => {
    const { strings } = useLocale()
    const { data: weapon } = useWeapon(hash)

    return (
        <div
            style={{ display: "flex", gap: "1em", padding: "1em" }}
            className={styles["entry-card"]}>
            <Image
                unoptimized
                src={weapon?.icon ? `https://www.bungie.net${weapon.icon}` : Question_Mark}
                alt={weapon?.name ?? ""}
                width={96}
                height={96}
                style={{ maxHeight: "60px", maxWidth: "60px", borderRadius: "4px" }}
            />
            <div className={styles["summary-stat-info"]}>
                <Link
                    className={[styles["summary-stat-name"], styles["contained-span"]].join(" ")}
                    href={`https://www.light.gg/db/items/${hash}/`}
                    target="_blank">
                    {weapon?.name ?? strings.loading}
                </Link>
                <span
                    className={[styles["summary-stat-value"], styles["contained-span"]].join(" ")}>
                    {stats.kills}
                </span>
            </div>
        </div>
    )
}

const AbilityCell = ({
    name,
    value,
    icon
}: {
    name: string
    value: number
    icon: StaticImageData
}) => {
    return (
        <div
            style={{ display: "flex", gap: "1em", padding: "1em" }}
            className={styles["entry-card"]}>
            <Image
                unoptimized
                src={icon}
                alt={name}
                width={96}
                height={96}
                style={{ maxHeight: "60px", maxWidth: "60px", borderRadius: "4px" }}
            />
            <div className={styles["summary-stat-info"]}>
                <span className={[styles["summary-stat-name"], styles["contained-span"]].join(" ")}>
                    {name}
                </span>
                <span
                    className={[styles["summary-stat-value"], styles["contained-span"]].join(" ")}>
                    {value}
                </span>
            </div>
        </div>
    )
}

export default AllWeapons
