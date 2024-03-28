"use client"

import { LazyMotion } from "framer-motion"
import { useRouter, useServerInsertedHTML } from "next/navigation"
import { useState, type ReactNode } from "react"
import { ServerStyleSheet, StyleSheetManager, ThemeProvider } from "styled-components"
import { theme } from "../theme"

// General manager for client-side tools
export const ClientManager = (props: { children: ReactNode }) => {
    const router = useRouter()
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    router.prefetch = () => {}

    return (
        <StyledComponentsManager>
            <FramerMotionManager>{props.children}</FramerMotionManager>
        </StyledComponentsManager>
    )
}

const FramerMotionManager = (props: { children: ReactNode }) => (
    <LazyMotion
        features={async () => import("framer-motion").then(module => module.domAnimation)}
        strict>
        {props.children}
    </LazyMotion>
)

const StyledComponentsManager = ({ children }: { children: ReactNode }) => {
    // Only create stylesheet once with lazy initial state
    // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
    const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

    useServerInsertedHTML(() => {
        const styles = styledComponentsStyleSheet.getStyleElement()
        styledComponentsStyleSheet.instance.clearTag()
        return <>{styles}</>
    })

    return (
        <ThemeProvider theme={theme}>
            {typeof window === "undefined" ? (
                <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
                    {children}
                </StyleSheetManager>
            ) : (
                <>{children}</>
            )}
        </ThemeProvider>
    )
}
