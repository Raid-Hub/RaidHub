"use client"

import styled, { keyframes } from "styled-components"

const pulse = keyframes`
    0% {
        opacity: 0.95;
    }
    50% {
        opacity: 0.5;
    }
    100% {
        opacity: 0.95;
    }
`
export const Loading = styled.div<{
    $flex?: number
    $fill?: boolean
    $speed?: number
    $minWidth?: string
    $minHeight?: string
    $borderRadius?: string
    $alpha?: number
}>`
    animation: ${pulse} 4s ease-in-out 0.5s infinite;
    animation-duration: ${props => (props.$speed ?? 1) * 1.5}s;
    animation-timing-function: ease-in-out;
    animation-delay: 0.5s;
    animation-iteration-count: infinite;
    animation-direction: normal;
    animation-fill-mode: none;
    animation-play-state: running;

    border-radius: ${({ $borderRadius }) => $borderRadius ?? "inherit"};

    ${props => (props.$fill ? "height: 100%; width: 100%;" : "")}
    background-color: rgba(20, 20, 20, ${props => props.$alpha});
`

Loading.defaultProps = {
    $fill: true,
    $speed: 1,
    $minWidth: "100%",
    $minHeight: "100%",
    $alpha: 0.5
}
