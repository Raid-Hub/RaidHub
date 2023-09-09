import { Member } from "~/pages/fireteam"
import styles from "~/styles/pages/fireteam.module.css"
import Search from "./Search"
import { Dispatch, SetStateAction, useState } from "react"

export default function FireteamHeader({ addMember }: { addMember: (member: Member) => void }) {
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
    return (
        <div className={styles["header"]}>
            <h1>Fireteam View</h1>
            <div className={styles["search-container"]}>
                <Search addMember={addMember} />
                <Checkbox isChecked={isCheckboxChecked} setIsChecked={setIsCheckboxChecked} />
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
        <div className="checkbox-wrapper">
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
