"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Dispatch, SetStateAction, useState } from "react"
import Search from "./Search"
import styles from "./guardians.module.css"

export default function InspectionHeader({
    addMember,
    clearAllMembers,
    memberIds,
    isExpanded,
    setExpanded
}: {
    addMember: (membershipId: string, isFireteamIncluded: boolean) => void
    clearAllMembers: () => void
    memberIds: Set<string>
    setExpanded: (isExpanded: boolean) => void
    isExpanded: boolean
}) {
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
    const queryClient = useQueryClient()

    return (
        <div className={styles["header"]}>
            <h1>Guardian Lookup Page</h1>
            <div className={styles["controls"]}>
                <Search addMember={membershipId => addMember(membershipId, isCheckboxChecked)} />
                <Checkbox isChecked={isCheckboxChecked} setIsChecked={setIsCheckboxChecked} />
                <button
                    onClick={() => {
                        queryClient.refetchQueries({
                            queryKey: ["bungie", "profile"],
                            type: "active"
                        })
                    }}>
                    Refresh
                </button>
                <button onClick={clearAllMembers}>Clear</button>
                <button onClick={() => setExpanded(!isExpanded)}>
                    {isExpanded ? "Condense" : "Expand"}
                </button>
            </div>
        </div>
    )
}

function Checkbox({
    isChecked,
    setIsChecked
}: {
    isChecked: boolean
    setIsChecked: Dispatch<SetStateAction<boolean>>
}) {
    return (
        <div>
            <label htmlFor="locked-fireteam">Include fireteam?</label>
            <input
                id="locked-fireteam"
                type="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(prev => !prev)}
            />
        </div>
    )
}
