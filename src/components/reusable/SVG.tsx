import React from "react"

export type SvgParentProps = {
    sx: number
    color?: string
}
export default function SVG({
    sx,
    color,
    children,
    ref,
    ...props
}: SvgParentProps & React.SVGProps<SVGSVGElement>) {
    return (
        <svg fill={color} width={sx} ref={ref} xmlns="http://www.w3.org/2000/svg" {...props}>
            {children}
        </svg>
    )
}
