"use client"

import styled from "styled-components"

export const Flex = styled.div<{
    $relative?: boolean
    $padding?: number
    $direction?: "row" | "column"
    $gap?: number
    $align?: "center" | "flex-start" | "flex-end" | "stretch" | "space-between" | "space-around"
    $crossAxis?: "center" | "flex-start" | "flex-end" | "stretch"
}>`
    display: flex;
    position: ${({ $relative }) => ($relative ? "relative" : "static")};

    justify-content: ${({ $align }) => $align};
    align-items: ${({ $crossAxis }) => $crossAxis};
    flex-direction: ${({ $direction }) => $direction};
    gap: ${({ $gap }) => $gap}em;

    padding: ${({ $padding }) => $padding}em;
`

Flex.defaultProps = {
    $padding: 1,
    $gap: 1,
    $direction: "row",
    $align: "center",
    $crossAxis: "center"
}
