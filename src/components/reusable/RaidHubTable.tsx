import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"
import styles from "~/styles/data-table.module.css"

/* EXAMPLE USAGE
const { columnLabels, rows } = parseRawSQL<["raid", "attempts", "clears", "kills"]>(
    `raid         | attempts | clears |   kills   
    ---------------------+----------+--------+-----------
     King's Fall         |    39958 |   4483 | 231788168
     Last Wish           |   494586 |  19030 |  22780427
     Crota's End         |    54981 |  27709 |  15145506
     Vault of Glass      |    24581 |   5843 |   2628054
     Root of Nightmares  |    18166 |   9701 |   2530861
     Vow of the Disciple |    33062 |   3470 |   2331819
     Deep Stone Crypt    |    14999 |   5517 |   1334354
     Garden of Salvation |    16744 |   2906 |    881889`,
    {
        kills: value => <i>{formattedNumber(value, "en-US")}</i>,
        clears: value => formattedNumber(value, "en-US"),
        attempts: value => formattedNumber(value, "en-US")
    }
)
*/

export default function RaidHubTable<T extends string[]>({
    title,
    columnLabels,
    rows
}: {
    title: string
    columnLabels: T
    rows: Record<T[number], any>[]
}) {
    return (
        <div className={styles["container"]}>
            <div style={{ display: "flex" }}>
                <h2 style={{ marginRight: "1em" }}>{title}</h2>
                <div>
                    <Image src="/logo.png" width={50} height={50} alt="logo" />
                </div>
            </div>
            <div>
                <table className={styles["table"]}>
                    <thead>
                        <tr>
                            {columnLabels.map((label, idx) => (
                                <th key={idx}>{label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={idx}>
                                {Object.values(row).map((c, i) => (
                                    <td key={i}>{c as ReactNode}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={styles["attribution"]}>
                    Source:{" "}
                    <Link href="https://raidhub.app" className={styles["link"]}>
                        raidhub.app
                    </Link>
                </div>
            </div>
        </div>
    )
}

export function parseRawSQL<T extends readonly string[]>(
    columnLabels: T,
    output: string,
    formatter: Partial<Record<T[number], (value: any) => ReactNode>>
): {
    rows: Record<keyof T, string>[]
} {
    const lines = output.split("\n")
    lines.splice(1, 1)
    const [header, ...rows] = lines

    return {
        // @ts-ignore
        columnLabels,
        // @ts-ignore
        rows: rows.map(r =>
            Object.fromEntries(
                r.split("|").map((t, i) => {
                    return [
                        columnLabels[i],
                        // @ts-ignore
                        formatter[columnLabels[i]] ? formatter[columnLabels[i]](t.trim()) : t.trim()
                    ] as const
                })
            )
        )
    }
}
