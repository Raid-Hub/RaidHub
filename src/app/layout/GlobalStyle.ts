"use client"

import { createGlobalStyle } from "styled-components"
import { $media } from "./media"

export const GlobalStyle = createGlobalStyle`
    a {
        text-decoration: none;
        color: ${({ theme }) => theme.colors.text.orange};
    }

    img[src=""] {
        font-size: 0;
        position: relative;
    }

   .switch-sm {
        ${$media.invert.max.mobile`
            display: none;
        `}
    }

    .switch-lg {
        ${$media.max.mobile`
            display: none;
        `}
    }
`
