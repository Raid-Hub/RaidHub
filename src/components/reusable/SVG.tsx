import React from "react"
import styles from "~/styles/svg-icons.module.css"

export type SVGProps = {
    sx?: number
    color?: string
} & React.SVGProps<SVGSVGElement>

export type SVGComponent = (props: SVGProps) => JSX.Element

export default function SVG({
    sx,
    color,
    children,
    className,
    iconId,
    ...props
}: { iconId?: string } & SVGProps) {
    const colorClass = iconId ? styles[iconId] : ""
    return (
        <svg
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
