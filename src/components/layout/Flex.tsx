"use client"

import styled from "styled-components"

export const Flex = styled.div<{
    $relative?: boolean
    $padding?: number
    $paddingX?: number
    $paddingY?: number
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
    ${({ $paddingX }) =>
        $paddingX && `padding-left: ${$paddingX}em; padding-right: ${$paddingX}em;`}
    ${({ $paddingY }) =>
        $paddingY && `padding-top: ${$paddingY}em; padding-bottom: ${$paddingY}em;`}
    ${({ $fullWidth }) => $fullWidth && "min-width: 100%;"}
`

Flex.defaultProps = {
    $relative: false,
    $padding: 1,
    $paddingX: undefined,
    $paddingY: undefined,
    $gap: 1,
    $direction: "row",
    $align: "center",
    $crossAxis: "center",
    $fullWidth: false,
    $wrap: false
}
