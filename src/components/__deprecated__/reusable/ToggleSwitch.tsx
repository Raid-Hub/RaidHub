import { type ChangeEvent } from "react"
import styles from "./toggle-switch.module.css"

type ToggleProps = {
    value: boolean
    onToggle: (state: boolean) => void
    size: number
    id: string
}
/**
 * @deprecated
 */
const ToggleSwitch = ({ onToggle, size, value, id }: ToggleProps) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onToggle(event.target.checked)
    }

    const width = `${2 * size}px`
    const height = `${size}px`

    return (
        <div className={styles.toggle}>
            <input
                type="checkbox"
                checked={value}
                name={id}
                id={id}
                className={styles.checkbox}
                onChange={handleChange}
            />
            <label htmlFor={id} style={{ width, height, borderRadius: height }} />
        </div>
    )
}

export default ToggleSwitch
