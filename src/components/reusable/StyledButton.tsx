import { ButtonHTMLAttributes, DetailedHTMLProps } from "react"
import styles from "../../styles/reusable-components/styled-button.module.css"

const StyledButton = ({
    children,
    className,
    ...params
}: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => {
    return (
        <button
            className={[className, styles["styled-button"]].filter(Boolean).join(" ")}
            {...params}>
            {children}
        </button>
    )
}

export default StyledButton
