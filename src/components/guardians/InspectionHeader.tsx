import styles from "~/styles/pages/inpsect.module.css"
import Search from "./Search"
import { Dispatch, SetStateAction, useState } from "react"
import { useBungieClient } from "../app/TokenManager"
import { GuardianData } from "~/types/guardian"

export default function InspectionHeader({
    addMember,
    clearAllMembers,
    memberIds,
    isExpanded,
    setExpanded
}: {
    addMember: (member: GuardianData) => void
    clearAllMembers: () => void
    memberIds: string[]
    setExpanded: (isExpanded: boolean) => void
    isExpanded: boolean
}) {
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
    const bungie = useBungieClient()

    return (
        <div className={styles["header"]}>
            <h1>Guardian Lookup Page</h1>
            <div className={styles["controls"]}>
                <Search
                    addMember={membershipId =>
                        addMember({ membershipId, isFireteamIncluded: isCheckboxChecked })
                    }
                />
                <Checkbox isChecked={isCheckboxChecked} setIsChecked={setIsCheckboxChecked} />
                <button
                    onClick={() => {
                        bungie.profileTransitory.refetchQueries(query =>
                            memberIds.some(id => query.queryKey.includes(id))
                        )
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
