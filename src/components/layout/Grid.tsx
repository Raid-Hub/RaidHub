"use client"

import styled from "styled-components"

export const Grid = styled.section<{
    $minCardWidth?: number
    $gap?: number
}>`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(${props => props.$minCardWidth}px, 1fr));
    gap: ${props => props.$gap}em;
`

Grid.defaultProps = {
    $minCardWidth: 250,
    $gap: 1.5
}
