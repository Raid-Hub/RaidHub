import styles from "../../../styles/pages/profile/raids.module.css"
import { ChangeEvent } from "react"

type ToggleProps = {
    defaultState: boolean
    onToggle: (state: boolean) => void
}

const ToggleSwitch = ({ defaultState, onToggle }: ToggleProps) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onToggle(event.target.checked)
    }

    return (
        <div className={styles["layout-toggle"]}>
            <span className={styles["description-toggle"]}>Raids</span>
            <label className={styles["switch"]}>
                <input type="checkbox" onChange={handleChange} defaultChecked={defaultState} />
                <span className="slider" />
            </label>
            <span className={styles["description-toggle"]}>History</span>
        </div>
    )
}

export default ToggleSwitch
