import { useState } from "react"
import styles from "../../styles/profile.module.css"
import { RADIUS, SPACING } from "./profile/DotGraph"

const red = "#F44336"
const green = "#4CAF50"

type ToggleProps = {
    defaultState: boolean
    onToggle: (state: boolean) => void
}

const ToggleSwitch = ({ defaultState, onToggle }: ToggleProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onToggle(event.target.checked)
    }

    return (
        <label className="switch">
            <input type="checkbox" onChange={handleChange} defaultChecked={defaultState} />
            <span className="slider" />
        </label>
    )
}

export default ToggleSwitch
