"use client"

import { useQueryClient } from "@tanstack/react-query"
import { type Dispatch, type SetStateAction } from "react"
import { useQueryParams } from "~/hooks/util/useQueryParams"
import Search from "./Search"
import styles from "./guardians.module.css"

/** @deprecated */
export default function InspectionHeader({
    isExpanded,
    setExpanded
}: {
    setExpanded: Dispatch<SetStateAction<boolean>>
    isExpanded: boolean
}) {
    const queryClient = useQueryClient()
    const params = useQueryParams<{
        membershipId: string
    }>()

    return (
        <div className={styles.header}>
            <h1>Guardian Lookup Page</h1>
            <div className={styles.controls}>
                <Search />
                <button
                    onClick={() => {
                        void queryClient.refetchQueries({
                            queryKey: ["bungie", "profile"],
                            type: "active"
                        })
                    }}>
                    Refresh
                </button>
                <button
                    onClick={() => {
                        params.clear()
                        params.commit(true)
                    }}>
                    Clear
                </button>
                <button onClick={() => setExpanded(old => !old)}>
                    {isExpanded ? "Condense" : "Expand"}
                </button>
            </div>
        </div>
    )
}
