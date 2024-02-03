import { Dispatch, SetStateAction, useState } from "react"
import styles from "~/styles/pages/inpsect.module.css"
import { useBungieClient } from "../../app/managers/BungieTokenManager"
import Search from "./Search"

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
    const bungie = useBungieClient()

    return (
        <div className={styles["header"]}>
            <h1>Guardian Lookup Page</h1>
            <div className={styles["controls"]}>
                <Search addMember={membershipId => addMember(membershipId, isCheckboxChecked)} />
                <Checkbox isChecked={isCheckboxChecked} setIsChecked={setIsCheckboxChecked} />
                <button
                    onClick={() => {
                        bungie.profileTransitory.refetchQueries(query =>
                            Array.from(memberIds).some(id => query.queryHash.includes(id))
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
