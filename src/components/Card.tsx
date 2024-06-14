"use client"

import styled from "styled-components"

export const Card = styled.div<{
    $fullWidth?: boolean
    $fullHeight?: boolean
    $overflowHidden?: boolean
    $borderRadius?: number
    $opacity?: number
    $color?: "light" | "dark" | "medium"
}>`
    position: relative;
    background-color: color-mix(
        in srgb,
        ${props => props.theme.colors.background[props.$color!]},
        #0000 ${({ $opacity }) => $opacity}%
    );
    border-radius: ${props => props.$borderRadius}px;
    border: 1px solid color-mix(in srgb, ${props => props.theme.colors.border.dark}, #0000 60%);

    ${props => (props.$fullWidth ? "min-width: 100%;" : "")}
    ${props => (props.$fullHeight ? "min-height: 100%;" : "")}
    ${({ $overflowHidden }) => ($overflowHidden ? "overflow: hidden;" : "")}
`

Card.defaultProps = {
    $fullWidth: false,
    $overflowHidden: false,
    $borderRadius: 2,
    $opacity: 75,
    $color: "medium"
}
