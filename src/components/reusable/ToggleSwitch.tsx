import styles from "../../styles/reusable-components.module.css"
import { ChangeEvent, useState } from "react"
import { useLocale } from "../app/LocaleManager"
import { v4 } from "uuid"

type ToggleProps = {
    defaultValue: boolean
    onToggle: (state: boolean) => void
    size: number
    label?: string
}

const ToggleSwitch = ({ onToggle, size, defaultValue, label }: ToggleProps) => {
    const [id] = useState(v4())
    const [checked, setChecked] = useState(defaultValue)
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onToggle(event.target.checked)
        setChecked(event.target.checked)
    }

    const width = `${2 * size}px`
    const height = `${size}px`

    return (
        <div className={styles["toggle"]}>
            <input
                type="checkbox"
                checked={checked}
                name={label ?? "toggle-switch"}
                id={label ?? id}
                className={styles["checkbox"]}
                onChange={handleChange}
            />
            <label htmlFor={label ?? id} style={{ width, height, borderRadius: height }} />
        </div>
    )
    // return (
    //     <div className={styles["layout-toggle"]}>
    //         <span
    //             className={styles["description-toggle"] + (!checked ? " " + styles["checked"] : "")}
    //             onClick={() => onToggle(false)}>
    //             {strings.toggle.charts}
    //         </span>
    //         <label className={styles["switch"]}>
    //         <input type="checkbox" onChange={handleChange} defaultChecked={checked} />
    //         <span className="slider always-on" />
    //     </label>
    //         <span
    //             className={styles["description-toggle"] + (checked ? " " + styles["checked"] : "")}
    //             onClick={() => onToggle(true)}>
    //             {strings.toggle.tiles}
    //         </span>
    //     </div>
    // )
}

export default ToggleSwitch

// .layout-toggle {
//     height: 6rem;
//     min-width: min-content;
//     width: 80%;
//     flex: 1;

//     padding: 1em;

//     background-color: var(--modal-background);
//     border: 1px solid var(--border);
//     border-radius: 20px;

//     display: flex;
//     gap: 1.3rem;
//     flex-direction: row;
//     justify-content: space-around;
//     align-items: center;
//     overflow: hidden;
// }

// .description-toggle {
//     min-width: 4rem;
//     text-align: center;
//     display: block;

//     text-transform: uppercase;
//     color: var(--secondary-text);
//     font-size: 0.8em;
// }

// .description-toggle:hover {
//     cursor: pointer;
// }

// .description-toggle.checked {
//     font-weight: 600;
//     color: var(--tertiary-text);
// }

// @media (min-width: 960px) {
//     .description-toggle {
//         font-size: 1em;
//     }
// }
// /* The switch - the box around the slider */
// .switch {
//     flex-shrink: 0;
//     transform: rotate(90deg);
//     position: relative;
//     display: inline-block;
//     width: 34px;
//     height: 60px;
// }

// /* Hide default HTML checkbox */
// .switch input {
//     opacity: 0;
//     width: 0;
//     height: 0;
// }
