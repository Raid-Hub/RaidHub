"use client"

import { LazyMotion } from "framer-motion"
import { ReactNode } from "react"

export function FramerMotionManager(props: { children: ReactNode }) {
    return (
        <LazyMotion
            features={async () => import("framer-motion").then(module => module.domAnimation)}
            strict>
            {props.children}
        </LazyMotion>
    )
}
