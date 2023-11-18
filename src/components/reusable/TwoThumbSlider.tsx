import { ChangeEventHandler } from "react"

type x = {
    onChange: (vals: [number, number]) => void
}

const TwoThumbSlider = (props: {
    onChange: (vals: [number, number]) => void
    values: [number, number]
    labels: [string, string]
    min: number
    max: number
    scale(v: number): number
}) => {
    const handleSliderChange =
        (idx: number): ChangeEventHandler<HTMLInputElement> =>
        event => {
            const { value } = event.target
            const newValues = props.values
            props.values[idx] = props.scale(parseInt(value, 10))
            props.onChange(newValues)
        }

    return (
        <div style={{ margin: "20px", width: "80%" }}>
            <label>{props.values[0]}</label>
            <input
                type="range"
                min={props.min}
                max={props.max}
                defaultValue={props.values[0]}
                name={props.labels[0]}
                onChange={handleSliderChange(0)}
                style={{ width: "100%" }}
            />
            <label>{props.values[1]}</label>
            <input
                type="range"
                min={props.min}
                max={props.max}
                defaultValue={props.values[1]}
                name={props.labels[1]}
                onChange={handleSliderChange(1)}
                style={{ width: "100%" }}
            />
        </div>
    )
}

export default TwoThumbSlider
