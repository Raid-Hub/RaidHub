import styles from "~/styles/pages/pgcr.module.css"
import Image from "next/image"
import { IPGCREntry, WeaponStatsValues } from "../../types/pgcr"
import Link from "next/link"
import StyledButton from "../reusable/StyledButton"
import { useLocale } from "../app/LocaleManager"
import { useItem } from "../app/DestinyManifestManager"
import { bungieItemUrl } from "~/util/destiny/bungie-icons"
import QuestionMark from "~/images/icons/QuestionMark"
import { SVGComponent } from "../reusable/SVG"
import Grenade from "~/images/icons/destiny2/Grenade"
import Melee from "~/images/icons/destiny2/Melee"

type AbilityData = {
    name: string
    value: number
    icon: SVGComponent
}
const AllWeapons = ({ entry, back }: { entry: IPGCREntry; back: () => void }) => {
    const { strings } = useLocale()
    const abilityCellData: AbilityData[] = [
        {
            name: strings.super,
            value: entry.stats.superKills,
            icon: QuestionMark
        },
        { name: strings.grenade, value: entry.stats.grenadeKills, icon: Grenade },
        { name: strings.melee, value: entry.stats.meleeKills, icon: Melee }
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
    const { data: weapon } = useItem(hash)

    return (
        <div
            style={{ display: "flex", gap: "1em", padding: "1em" }}
            className={styles["entry-card"]}>
            {weapon?.displayProperties.icon ? (
                <Image
                    unoptimized
                    src={bungieItemUrl(weapon.displayProperties.icon)}
                    alt={weapon?.displayProperties.name ?? ""}
                    width={96}
                    height={96}
                    className={styles["weapon-icon"]}
                />
            ) : (
                <QuestionMark sx={96} color="white" />
            )}
            <div className={styles["summary-stat-info"]}>
                <Link
                    className={[styles["summary-stat-name"], styles["contained-span"]].join(" ")}
                    href={`https://www.light.gg/db/items/${hash}/`}
                    target="_blank">
                    {weapon?.displayProperties.name ?? strings.loading}
                </Link>
                <span
                    className={[styles["summary-stat-value"], styles["contained-span"]].join(" ")}>
                    {stats.kills}
                </span>
            </div>
        </div>
    )
}

const AbilityCell = ({ name, value, icon: Icon }: AbilityData) => {
    return (
        <div
            style={{ display: "flex", gap: "1em", padding: "1em" }}
            className={styles["entry-card"]}>
            <Icon sx={60} color="white" />
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
