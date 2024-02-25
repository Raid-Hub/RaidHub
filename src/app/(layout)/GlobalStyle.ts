"use client"

import { createGlobalStyle } from "styled-components"

export const GlobalStyle = createGlobalStyle`
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
        color: ${({ theme }) => theme.colors.text.orange};
    }

    img[src=""] {
        font-size: 0;
        position: relative;
    }
`
