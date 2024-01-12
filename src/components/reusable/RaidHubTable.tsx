import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { z } from "zod"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"
import styles from "~/styles/data-table.module.css"
import { bungieIconUrl } from "~/util/destiny/bungie-icons"
import { formattedNumber } from "~/util/presentation/formatting"

export function RaidHubTable<T extends string[]>({
    columnLabels,
    rows
}: {
    columnLabels: T
    rows: Record<T[number], any>[]
}) {
    const [isEditing, setIsEditing] = useState(false)
    const [fns, setFns] = useState<
        Record<string, (typeof ColumnFormats)[keyof typeof ColumnFormats]>
    >({})

    const { value: queryTitle, save: setQueryTitle } = useLocalStorage(
        "admin-query-title",
        "My Table"
    )

    return (
        <div className={styles["container"]}>
            <button onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Save" : "Edit"}</button>
            <div className={styles["table-area"]}>
                <div style={{ display: "flex" }}>
                    <h2 style={{ marginRight: "1em" }}>
                        {isEditing ? (
                            <form className={styles["title-form-container"]}>
                                <input
                                    id="table-name"
                                    value={queryTitle}
                                    onChange={e => setQueryTitle(e.target.value)}
                                    placeholder="Set a table name"
                                />
                            </form>
                        ) : (
                            queryTitle
                        )}
                    </h2>
                    <div>
                        <Image src="/logo.png" width={50} height={50} alt="logo" />
                    </div>
                </div>
                <div>
                    <table className={styles["table"]}>
                        <thead>
                            <tr>
                                {columnLabels.map((label, idx) => (
                                    <ColumnLabel
                                        key={idx}
                                        label={label}
                                        isEditing={isEditing}
                                        setColumnFn={(label, fn) =>
                                            setFns(fns => ({ ...fns, [label]: fn }))
                                        }
                                    />
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, idx) => (
                                <tr key={idx}>
                                    {Object.values(row).map((value, i) => {
                                        const Formatter =
                                            fns[columnLabels[i]] ?? ColumnFormats.string
                                        return (
                                            <td key={i}>
                                                <Formatter value={value as never} />
                                            </td>
                                        )
                                    })}
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
        </div>
    )
}

const ColumnLabel = ({
    label,
    isEditing,
    setColumnFn
}: {
    label: string
    isEditing: boolean
    setColumnFn: (label: string, fn: (typeof ColumnFormats)[keyof typeof ColumnFormats]) => void
}) => {
    const { save: saveLabel, value: customLabel } = useLocalStorage(
        `admin-query-table-column-label-${label}`,
        label
    )
    const { save: saveDataType, value: customDataType } = useLocalStorage<
        keyof typeof ColumnFormats
    >(`admin-query-table-data-type-${label}`, "string")

    useEffect(
        () => setColumnFn(label, ColumnFormats[customDataType]),
        [customDataType, label, setColumnFn]
    )

    return (
        <th>
            {isEditing ? (
                <form>
                    <div>
                        <label style={{ fontSize: "12px", fontWeight: 400 }}>{label}</label>
                    </div>
                    <input
                        type="text"
                        value={customLabel}
                        onChange={e => saveLabel(e.target.value)}
                        placeholder="Enter column name"
                    />
                    <div>
                        <select
                            id="selector"
                            value={customDataType}
                            onChange={e =>
                                saveDataType(e.target.value as keyof typeof ColumnFormats)
                            }>
                            {Object.keys(ColumnFormats).map(key => (
                                <option key={key} value={key}>
                                    {key}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>
            ) : (
                customLabel
            )}
        </th>
    )
}

const ColumnFormats = {
    string: (props: { value: string }) => <>{props.value.toString()}</>,
    number: (props: { value: number }) => <>{formattedNumber(props.value, "en-US")}</>,
    time: (props: { value: string }) => <>{new Date(props.value).toLocaleTimeString()}</>,
    date: (props: { value: string }) => <>{new Date(props.value).toLocaleDateString()}</>,
    datetime: (props: { value: string }) => <>{new Date(props.value).toLocaleString()}</>,
    bungieIcon: (props: { value: string }) => {
        const url = z.string().url().safeParse(bungieIconUrl(props.value))
        return url.success ? (
            <Image src={url.data} width={50} height={50} alt="" unoptimized />
        ) : (
            <span>Invalid Image</span>
        )
    }
}
