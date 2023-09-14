import styles from "~/styles/pages/inpsect.module.css"
import Search from "./Search"
import { Dispatch, SetStateAction, useState } from "react"
import { InpsectionMemberData } from "~/types/profile"
import { useBungieClient } from "../app/TokenManager"

export default function InspectionHeader({
    addMember,
    clearAllMembers,
    memberIds
}: {
    addMember: (member: InpsectionMemberData) => void
    clearAllMembers: () => void
    memberIds: string[]
}) {
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
    const bungie = useBungieClient()

    return (
        <div className={styles["header"]}>
            <h1>Inpsection Page</h1>
            <div className={styles["controls"]}>
                <Search
                    addMember={membershipId =>
                        addMember({ membershipId, isFireteamIncluded: isCheckboxChecked })
                    }
                />
                <Checkbox isChecked={isCheckboxChecked} setIsChecked={setIsCheckboxChecked} />
                <button
                    onClick={() => {
                        bungie.profile.refetchQueries({
                            predicate(query) {
                                return memberIds.some(id => query.queryHash.includes(id))
                            }
                        })

                        bungie.profileTransitory.refetchQueries({
                            predicate(query) {
                                return memberIds.some(id => query.queryHash.includes(id))
                            }
                        })
                    }}>
                    Refresh
                </button>
                <button onClick={clearAllMembers}>Clear</button>
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
