import styles from "../../../styles/pages/profile/mid.module.css"
import { ChangeEvent } from "react"
import { useLocale } from "../../app/LanguageProvider"

type ToggleProps = {
    checked: boolean
    onToggle: (state: boolean) => void
}

const ToggleSwitch = ({ checked, onToggle }: ToggleProps) => {
    const { strings } = useLocale()
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onToggle(event.target.checked)
    }

    return (
        <div className={styles["layout-toggle"]}>
            <span
                className={styles["description-toggle"] + (!checked ? " " + styles["checked"] : "")}
                onClick={() => onToggle(false)}>
                {strings.toggle.charts}
            </span>
            <label className={styles["switch"]}>
                <input type="checkbox" onChange={handleChange} defaultChecked={checked} />
                <span className="slider always-on" />
            </label>
            <span
                className={styles["description-toggle"] + (checked ? " " + styles["checked"] : "")}
                onClick={() => onToggle(true)}>
                {strings.toggle.tiles}
            </span>
        </div>
    )
}

export default ToggleSwitch
