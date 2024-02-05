import { DefaultTheme, createGlobalStyle, css } from "styled-components"
import { o } from "~/util/o"

export const deviceSizes = {
    tiny: { min: "0px", max: "374px" },
    mobile: { min: "320px", max: "768px" },
    tablet: { min: "640px", max: "1024px" },
    laptop: { min: "1025px", max: "2560px" },
    desktop: { min: "1440px", max: "9999px" }
} as const satisfies Record<string, { min: string; max: string }>
export const theme: DefaultTheme = {
    colors: {
        icon: {
            white: "rgb(255, 255, 255)",
            orange: "rgb(255, 140, 57)",
            twitch: "rgb(100, 65, 165)",
            twitter: "rgb(29, 161, 242)",
            youtube: "rgb(241, 45, 45)",
            bungie: "rgb(154, 213, 236)",
            discord: "rgb(104, 118, 167)"
        },
        text: {
            white: "rgb(255, 255, 255)",
            primary: "rgb(253, 253, 253)",
            secondary: "rgb(183, 183, 183)",
            tertiary: "rgb(105, 105, 105)"
        },
        border: {
            light: "rgb(255, 255, 255)",
            medium: "rgb(170, 170, 170)",
            dark: "rgb(64, 64, 64)"
        },
        background: {
            light: "rgb(107, 107, 107)",
            medium: "rgb(51, 51, 51)",
            dark: "rgb(16, 16, 16)"
        },
        brand: {
            light: "rgb(255, 140, 57, 0.8)",
            primary: "rgb(240, 128, 47, 1)"
        },
        button: {
            green: "rgb(57, 195, 131)",
            destructive: "rgb(160, 79, 79)"
        },
        highlight: {
            orange: "rgb(255, 140, 57)"
        }
    }
}

export const GlobalStyle = createGlobalStyle<{}>`
* {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
}

html, body {
    height: 100%;
    margin: 0;
}

html {
    overscroll-behavior-y: contain;
    overflow-y: auto;
}

body {
    font-family: "Manrope", sans-serif;

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

// Scroll bars
/* width */
::-webkit-scrollbar {
    width: 7px;
    height: 7px;
    background-color: transparent;
}

/* Track */
::-webkit-scrollbar-track {
    background-color: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: var(--scroll-track);
    border-radius: 7px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: var(--brand-orange-light);
}
`

declare module "styled-components" {
    export interface DefaultTheme {
        colors: {
            icon: {
                white: string
                orange: string
                twitch: string
                twitter: string
                youtube: string
                bungie: string
                discord: string
            }
            text: {
                white: string
                primary: string
                secondary: string
                tertiary: string
            }
            border: {
                light: string
                medium: string
                dark: string
            }
            background: {
                light: string
                medium: string
                dark: string
            }
            brand: {
                light: string
                primary: string
            }
            button: {
                green: string
                destructive: string
            }
            highlight: {
                orange: string
            }
        }
    }
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
    ...values: ((dimensions: (typeof deviceSizes)[T]) => string)[]
) {
    const inner = String.raw(value, ...values.map(fn => fn(deviceSizes[device])))
    return css`
        @media (${dir}-width: ${deviceSizes[device][dir]}) {
            ${inner}
        }
    `
}
