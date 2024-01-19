import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { z } from "zod"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"
import styles from "~/styles/data-table.module.css"
import { bungieIconUrl } from "~/util/destiny/bungie-icons"
import { formattedNumber, secondsToYDHMS } from "~/util/presentation/formatting"
import ScreenshotContainer, { useScreenshot } from "./ScreenshotContainer"
import Logo from "../../../public/logo.png"

export function RaidHubTable<T extends string[]>({
    columnLabels,
    rows
}: {
    columnLabels: T
    rows: Record<T[number], any>[]
}) {
    const ref = useRef<HTMLDivElement>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [fns, setFns] = useState<
        Record<string, (typeof ColumnFormats)[keyof typeof ColumnFormats]>
    >({})

    const { value: queryTitle, save: setQueryTitle } = useLocalStorage(
        "admin-query-title",
        "My Table"
    )

    const setColumnFn = useMemo(() => {
        return Object.fromEntries(
            columnLabels.map(label => [
                label,
                (label: string, fn: (typeof ColumnFormats)[keyof typeof ColumnFormats]) =>
                    setFns(fns => ({ ...fns, [label]: fn }))
            ])
        )
    }, [columnLabels, setFns])

    return (
        <ScreenshotContainer
            childRef={ref}
            options={{
                useCORS: true,
                backgroundColor: "black",
                scale: 4
            }}>
            <div style={{ display: "flex", gap: "0.5em", padding: "0.5em" }}>
                <button onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Save" : "Edit"}
                </button>
                <ScreenshotButton title={queryTitle} />
            </div>

            <div className={styles["table-area"]} ref={ref}>
                <Image
                    className={styles["logo-img"]}
                    src={Logo}
                    alt="logo"
                    width={30}
                    height={30}
                    style={{ position: "absolute", top: 10, left: 10 }}
                />
                <h2 style={{ textAlign: "center", marginTop: 0 }}>
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
                    <table className={styles["table"]}>
                        <thead>
                            <tr>
                                {columnLabels.map((label, idx) => (
                                    <ColumnLabel
                                        key={idx}
                                        label={label}
                                        isEditing={isEditing}
                                        setColumnFn={setColumnFn[label]}
                                    />
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, idx) => (
                                <tr key={idx}>
                                    {Object.values(row).map((value, i) => (
                                        <Cell
                                            key={i}
                                            value={value as any}
                                            Formatter={fns[columnLabels[i]] ?? ColumnFormats.string}
                                        />
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className={styles["attribution"]}>
                        Source:{" "}
                        <Link href="https://raidhub.io" className={styles["link"]}>
                            raidhub.io
                        </Link>
                    </div>
                </div>
            </div>
        </ScreenshotContainer>
    )
}

const Cell = ({
    value,
    Formatter
}: {
    value: any
    Formatter: (typeof ColumnFormats)[keyof typeof ColumnFormats]
}) => {
    return <td>{value !== null ? <Formatter value={value as never} /> : null}</td>
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
    time: (props: { value: string }) => (
        <>
            {new Date(props.value).toLocaleTimeString(undefined, {
                timeZone: "America/Los_Angeles"
            })}
        </>
    ),
    date: (props: { value: string }) => <>{new Date(props.value).toLocaleDateString()}</>,
    datetime: (props: { value: string }) => <>{new Date(props.value).toLocaleString()}</>,
    duration: (props: { value: number }) => <>{secondsToYDHMS(props.value)}</>,
    bungieIcon: (props: { value: string }) => {
        const url = z.string().url().safeParse(bungieIconUrl(props.value))
        return url.success ? (
            <Image src={url.data} width={50} height={50} alt="" unoptimized />
        ) : (
            <span>Invalid Image</span>
        )
    }
}

const ScreenshotButton = ({ title }: { title: string }) => {
    const dl = useRef<HTMLAnchorElement>(null)
    const handleSuccess = async (blob: Blob) => {
        try {
            if (!dl.current) throw new Error("No ref")

            dl.current.href = URL.createObjectURL(blob)
            dl.current.download = `${title}.png`

            dl.current.click()

            URL.revokeObjectURL(dl.current.href)
        } catch (e: any) {
            alert(e.message)
        }
    }

    const { takeScreenshot } = useScreenshot({
        onSuccess: handleSuccess,
        onFailure: () => alert("Failed to take screenshot")
    })

    return (
        <div>
            <button onClick={takeScreenshot}>Screenshot</button>
            <a ref={dl} style={{ display: "none" }} />
        </div>
    )
}
