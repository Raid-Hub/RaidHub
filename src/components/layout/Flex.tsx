"use client"

import styled from "styled-components"

export const Flex = styled.div<{
    $relative?: boolean
    $padding?: number
    $direction?: "row" | "column"
    $gap?: number
    $align?: "center" | "flex-start" | "flex-end" | "stretch" | "space-between" | "space-around"
    $crossAxis?: "center" | "flex-start" | "flex-end" | "stretch"
    $fullWidth?: boolean
    $wrap?: boolean
}>`
    display: flex;
    position: ${({ $relative }) => ($relative ? "relative" : "static")};

    justify-content: ${({ $align }) => $align};
    align-items: ${({ $crossAxis }) => $crossAxis};
    flex-direction: ${({ $direction }) => $direction};
    gap: ${({ $gap }) => $gap}em;
    flex-wrap: ${({ $wrap }) => ($wrap ? "wrap" : "nowrap")};

    padding: ${({ $padding }) => $padding}em;
    ${({ $fullWidth }) => $fullWidth && "width: 100%;"}
`

Flex.defaultProps = {
    $padding: 1,
    $gap: 1,
    $direction: "row",
    $align: "center",
    $crossAxis: "center",
    $fullWidth: false,
    $wrap: false
}
