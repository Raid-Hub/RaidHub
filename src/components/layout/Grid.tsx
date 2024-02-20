"use client"

import styled from "styled-components"

export const Grid = styled.div<{
    $minCardWidth?: number
    $numCols?: number
    $gap?: number
}>`
    display: grid;
    grid-template-columns: repeat(
        ${props => props.$numCols ?? "auto-fill"},
        minmax(calc(min(${props => props.$minCardWidth}px, 100%)), 1fr)
    );
    gap: ${props => props.$gap}em;
`

Grid.defaultProps = {
    $minCardWidth: 250,
    $gap: 1.5
}
