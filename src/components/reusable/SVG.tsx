import React from "react"
import styles from "~/styles/svg-icons.module.css"

export type SVGProps = {
    sx: number
    color?: string
} & React.SVGProps<SVGSVGElement>

export default function SVG({
    sx,
    color,
    children,
    ref,
    className,
    iconId,
    ...props
}: { iconId: string } & SVGProps) {
    const colorClass = styles[iconId]
    return (
        <svg
            ref={ref}
            data-icon-id={iconId}
            width={sx}
            fill={color}
            className={[colorClass, styles["icon"], className].filter(Boolean).join(" ")}
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            {children}
        </svg>
    )
}
