"use client"

import styled, { css } from "styled-components"
import { $media } from "~/app/layout/media"

export const Grid = styled.div<{
    $minCardWidth?: number
    $minCardWidthMobile?: number
    $numCols?: number
    $gap?: number
    $fullWidth?: boolean
    $relative?: boolean
}>`
    position: ${props => (props.$relative ? "relative" : "static")};
    display: grid;
    ${props => css`
        grid-template-columns: repeat(
            ${props.$numCols ?? "auto-fill"},
            minmax(calc(min(${props.$minCardWidth}px, 100%)), 1fr)
        );

        ${$media.max.mobile`
            grid-template-columns: repeat(
                ${props.$numCols ?? "auto-fill"},
                minmax(calc(min(${props.$minCardWidthMobile}px, 100%)), 1fr)
            );
        `}
    `}

    gap: ${props => props.$gap}rem;
    width: ${props => (props.$fullWidth ? "100%" : "auto")};
`

Grid.defaultProps = {
    $minCardWidth: 250,
    $minCardWidthMobile: 200,
    $gap: 1.5
}
