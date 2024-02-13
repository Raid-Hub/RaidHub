"use client"

import { type ReactNode } from "react"
import { useMediaQuery } from "~/app/(layout)/media"

export const TabletDesktopSwitch = (props: {
    tablet: ReactNode
    desktop: ReactNode
    default: "desktop" | "tablet"
}) => {
    const isMobile = useMediaQuery("max", "tablet")
    if (typeof isMobile === "undefined") return props[props.default]
    return isMobile ? props.tablet : props.desktop
}
