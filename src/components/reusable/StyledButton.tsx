import styles from "../../styles/reusable-components/styled-button.module.css"

const StyledButton = ({ children, className, ...params }: React.ComponentProps<"button">) => {
    return (
        <button
            className={[className, styles["styled-button"]].filter(Boolean).join(" ")}
            {...params}>
            {children}
        </button>
    )
}

export default StyledButton
