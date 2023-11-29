import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"
import styles from "~/styles/data-table.module.css"

export default function RaidHubTable<T extends readonly any[]>({
    title,
    columnLabels,
    rows,
    mapper
}: {
    title: string
    columnLabels: string[]
    rows: [...T][]
    mapper?: (row: [...T]) => ReactNode[]
}) {
    const mappedRows = mapper ? rows.map(mapper) : rows
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
                        {mappedRows.map((row, idx) => (
                            <tr key={idx}>
                                {row.map((c, i) => (
                                    <td key={i}>{c}</td>
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
