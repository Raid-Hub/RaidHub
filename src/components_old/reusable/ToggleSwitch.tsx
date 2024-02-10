import { ChangeEvent } from "react"
import styles from "../../styles/reusable-components/toggle-switch.module.css"

type ToggleProps = {
    value: boolean
    onToggle: (state: boolean) => void
    size: number
    label: string
}
/**
 * @deprecated
 */
const ToggleSwitch = ({ onToggle, size, value, label }: ToggleProps) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onToggle(event.target.checked)
    }

    const width = `${2 * size}px`
    const height = `${size}px`

    return (
        <div className={styles["toggle"]}>
            <input
                type="checkbox"
                checked={value}
                name={label}
                id={label}
                className={styles["checkbox"]}
                onChange={handleChange}
            />
            <label htmlFor={label} style={{ width, height, borderRadius: height }} />
        </div>
    )
}

export default ToggleSwitch
