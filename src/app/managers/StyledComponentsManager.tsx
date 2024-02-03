"use client"

import { useServerInsertedHTML } from "next/navigation"
import { ReactNode, useState } from "react"
import { ServerStyleSheet, StyleSheetManager, ThemeProvider } from "styled-components"
import { GlobalStyle, theme } from "../theme"

export function StyledComponentsManager({ children }: { children: ReactNode }) {
    // Only create stylesheet once with lazy initial state
    // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
    const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

    useServerInsertedHTML(() => {
        const styles = styledComponentsStyleSheet.getStyleElement()
        styledComponentsStyleSheet.instance.clearTag()
        return <>{styles}</>
    })

    if (typeof window !== "undefined") return <>{children}</>

    return (
        <ThemeProvider theme={theme}>
            {typeof window !== "undefined" ? (
                children
            ) : (
                <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
                    <GlobalStyle />
                    {children}
                </StyleSheetManager>
            )}
        </ThemeProvider>
    )
}
