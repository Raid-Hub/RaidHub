"use client"

import styled from "styled-components"

export const Grid = styled.div<{
    $minCardWidth?: number
    $numCols?: number
    $gap?: number
    $fullWidth?: boolean
}>`
    display: grid;
    grid-template-columns: repeat(
        ${props => props.$numCols ?? "auto-fill"},
        minmax(calc(min(${props => props.$minCardWidth}px, 100%)), 1fr)
    );
    gap: ${props => props.$gap}rem;
    width: ${props => (props.$fullWidth ? "100%" : "auto")};
`

Grid.defaultProps = {
    $minCardWidth: 250,
    $gap: 1.5
}
