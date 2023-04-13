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
