import React from "react"

export type SVGProps = {
    sx: number
    color?: string
} & React.SVGProps<SVGSVGElement>

export default function SVG({ sx, color, children, ...props }: SVGProps) {
    return (
        <svg fill={color} width={sx} xmlns="http://www.w3.org/2000/svg" {...props}>
            {children}
        </svg>
    )
}
