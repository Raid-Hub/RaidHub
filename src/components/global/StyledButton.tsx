import { ButtonHTMLAttributes, DetailedHTMLProps } from "react"

const StyledButton = ({
    children,
    className,
    ...params
}: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => {
    return (
        <button className={[className, "styled-button"].filter(Boolean).join(" ")} {...params}>
            {children}
        </button>
    )
}

export default StyledButton
