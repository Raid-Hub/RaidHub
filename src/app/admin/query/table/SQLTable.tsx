"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useRef, useState } from "react"
import styled from "styled-components"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"
import { Cell } from "./Cell"
import { ColumnLabel } from "./ColumnLabel"
import { ColumnFormats } from "./formats"

export function SQLTable<T extends string[]>({
    columnLabels,
    rows
}: {
    columnLabels: T
    rows: readonly Record<T[number], unknown>[]
}) {
    const ref = useRef<HTMLDivElement>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [fns, setFns] = useState<
        Record<string, (typeof ColumnFormats)[keyof typeof ColumnFormats]>
    >({})

    const [queryTitle, setQueryTitle] = useLocalStorage("admin-query-title", "My Table")

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
        <form onSubmit={e => e.preventDefault()}>
            <button
                onClick={() => setIsEditing(isEditing => !isEditing)}
                type={isEditing ? "submit" : "button"}>
                {isEditing ? "Save" : "Edit"}
            </button>

            <TableArea ref={ref}>
                <Image
                    src="/logo.png"
                    alt="logo"
                    width={30}
                    height={30}
                    style={{ position: "absolute", top: 10, left: 10 }}
                />
                <h2 style={{ textAlign: "center", marginTop: 0 }}>
                    {isEditing ? (
                        <input
                            id="table-name"
                            value={queryTitle}
                            onChange={e => setQueryTitle(e.target.value)}
                            placeholder="Set a table name"
                        />
                    ) : (
                        queryTitle
                    )}
                </h2>
                <div>
                    <Table>
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
                    </Table>
                    <Attribution>
                        <span>Source: </span>
                        <Link href="https://raidhub.io">raidhub.io</Link>
                    </Attribution>
                </div>
            </TableArea>
        </form>
    )
}

const TableArea = styled.div`
    position: relative;
    padding: 2em;

    width: fit-content;

    background: linear-gradient(
        78deg,
        rgba(1, 0, 17, 1) 0%,
        rgba(1, 0, 17, 1) 25%,
        rgb(19, 1, 10) 48%,
        rgba(1, 0, 17, 1) 91%,
        rgba(19, 3, 1, 1) 100%
    );

    border: 1px solid color-mix(in srgb, ${({ theme }) => theme.colors.border.dark}, #0000 40%);
`

const Table = styled.table`
    border-collapse: collapse;
    background-color: color-mix(in srgb, ${({ theme }) => theme.colors.background.dark}, #0000 60%);

    & tr:nth-child(even) {
        background-color: color-mix(
            in srgb,
            ${({ theme }) => theme.colors.background.medium},
            #0000 80%
        );
    }

    & th,
    td {
        border-top: 1px solid
            color-mix(in srgb, ${({ theme }) => theme.colors.border.dark}, #0000 40%);
        border-bottom: 1px solid
            color-mix(in srgb, ${({ theme }) => theme.colors.border.dark}, #0000 40%);

        padding: 0.8em 1.2em;
        text-align: center;
        letter-spacing: 0.04em;

        font-weight: 500;
        font-size: 14px;
    }

    & td:first-child,
    th:first-child {
        border-left: 1px solid
            color-mix(in srgb, ${({ theme }) => theme.colors.border.dark}, #0000 40%);
    }

    & td:last-child,
    th:last-child {
        border-right: 1px solid
            color-mix(in srgb, ${({ theme }) => theme.colors.border.dark}, #0000 40%);
    }
`

const Attribution = styled.div`
    font-size: 0.8em;
    text-align: left;

    margin-top: 1em;

    font-style: italic;

    & a {
        letter-spacing: 0.04em;
        color: ${({ theme }) => theme.colors.text.orange};
    }
`
