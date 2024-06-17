"use client"

import styled from "styled-components"
import { CardTitle } from "~/components/typography/CardTitle"

export const CardSplash = styled.div`
    width: 100%;
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    overflow: hidden;
    position: relative;

    &::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 8px;
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
    }

    & img {
        width: 100%;
        height: auto;
        margin-top: -5%;
        margin-bottom: -5%;

        filter: brightness(90%);
    }
`

export const CardSplashTitleAbsolute = styled(CardTitle)`
    white-space: wrap;
    position: absolute;
    bottom: 0;
    left: 5%;
`
