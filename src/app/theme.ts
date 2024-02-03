import { DefaultTheme, createGlobalStyle, css } from "styled-components"
import { o } from "~/util/o"

const deviceSizes = {
    tiny: { min: "0px", max: "374px" },
    mobile: { min: "320px", max: "768px" },
    tablet: { min: "640px", max: "1024px" },
    laptop: { min: "1025px", max: "2560px" },
    desktop: { min: "1440px", max: "9999px" }
} as const satisfies Record<string, { min: string; max: string }>

export const theme: DefaultTheme = {
    socials: {
        twitch: "#6441a5",
        twitter: "#1da1f2",
        youtube: "#f12d2d",
        bungie: "#9ad5ec",
        discord: "#6876a7"
    },
    text: {
        primary: "#FFFFFF",
        secondary: "#E4E4E4",
        tertiary: "#B7B7B7"
    },
    border: {
        light: "#FFFFFF",
        medium: "#YourMediumBorderColor",
        dark: "#YourDarkBorderColor"
    },
    background: {
        light: "#YourLightBackgroundColor",
        medium: "#YourMediumBackgroundColor",
        dark: "#YourDarkBackgroundColor"
    },
    brand: {},
    button: {
        green: "39c383",
        destructive: "#a04f4f"
    }
}

export const GlobalStyle = createGlobalStyle<{}>`
* {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
}

html {
    overscroll-behavior-y: contain;
    overflow-y: auto;
}

body {
    font-family: "Manrope", sans-serif;
    padding: 0;
    margin: 0;

    background-color: #010011;
    background: linear-gradient(
        90deg,
        rgba(1, 0, 17, 1) 0%,
        rgba(1, 0, 17, 1) 25%,
        rgba(23, 1, 13, 1) 48%,
        rgba(1, 0, 17, 1) 91%,
        rgba(19, 3, 1, 1) 100%
    );
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
#content ::-webkit-scrollbar {
    width: 7px;
    height: 7px;
    background-color: transparent;
}

/* Track */
#content ::-webkit-scrollbar-track {
    background-color: transparent;
}

/* Handle */
#content ::-webkit-scrollbar-thumb {
    background: var(--scroll-track);
    border-radius: 7px;
}

/* Handle on hover */
#content ::-webkit-scrollbar-thumb:hover {
    background: var(--brand-orange-light);
}


/** Adjust the nprogress bar */
.nprogress-custom-parent {
    position: sticky;
}

#nprogress {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
}
#nprogress .bar {
    bottom: 0 !important;
    top: unset !important;
}

#nprogress .peg {
    display: none !important;
}
`

declare module "styled-components" {
    export interface DefaultTheme {
        socials: {
            twitch: string
            twitter: string
            youtube: string
            bungie: string
            discord: string
        }
        text: {
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
        brand: {}
        button: {
            green: string
            destructive: string
        }
    }
}

export const $media = {
    min: o.fromEntries(
        o.keys(deviceSizes).map(device => [device, deviceMediaQuery.bind(null, device, "min")])
    ),
    max: o.fromEntries(
        o.keys(deviceSizes).map(device => [device, deviceMediaQuery.bind(null, device, "max")])
    )
}

function deviceMediaQuery(
    device: keyof typeof deviceSizes,
    dir: "min" | "max",
    value: TemplateStringsArray
) {
    return css`
        @media (${dir}-width: ${deviceSizes[device][dir]}) {
            ${value}
        }
    `
}
