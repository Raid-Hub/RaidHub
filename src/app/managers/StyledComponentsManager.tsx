"use client"

import { useServerInsertedHTML } from "next/navigation"
import { ReactNode, useState } from "react"
import {
    ServerStyleSheet,
    StyleSheetManager,
    ThemeProvider,
    createGlobalStyle,
    css
} from "styled-components"
import { o } from "~/util/o"
import { deviceSizes, theme } from "../theme"

export function StyledComponentsManager({ children }: { children: ReactNode }) {
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
                    <GlobalStyle />
                    {children}
                </StyleSheetManager>
            ) : (
                children
            )}
        </ThemeProvider>
    )
}

export const $media = {
    min: queries("min"),
    max: queries("max")
}

function queries(dir: "min" | "max") {
    return o.mapValuesByKey(deviceSizes, k => deviceMediaQuery.bind(null, dir, k))
}

function deviceMediaQuery<T extends keyof typeof deviceSizes>(
    dir: "min" | "max",
    device: T,
    value: TemplateStringsArray,
    ...values: ((dimensions: (typeof deviceSizes)[T]) => string | number)[]
) {
    const inner = String.raw(value, ...values.map(fn => fn(deviceSizes[device])))
    return css`
        @media (${dir}-width: ${deviceSizes[device][dir]}) {
            ${inner}
        }
    `
}

const GlobalStyle = createGlobalStyle<{}>`
    * {
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
    }

    html, body {
        min-width: 300px;
    }

    html {
        overscroll-behavior-y: contain;
        overflow-y: auto;
    }

    body {
        font-family: "Manrope", sans-serif;
        margin: 0;

        display: flex;
        min-height: 100vh;
        flex-direction: column;

        background-color: #010011;
        background: linear-gradient(
            90deg,
            rgba(1, 0, 17, 1) 0%,
            rgba(1, 0, 17, 1) 25%,
            rgba(23, 1, 13, 1) 48%,
            rgba(1, 0, 17, 1) 91%,
            rgba(19, 3, 1, 1) 100%
        );
        background-size: 100% 100%;
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    img[src=""] {
        font-size: 0;
        position: relative;
    }
`
