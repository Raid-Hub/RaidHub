import styled, { css } from "styled-components"

export const Panel = styled.div<{
    $maxWidth?: number
    $fullWidth?: boolean
    $growOnHover?: boolean
}>`
    ${({ theme, $maxWidth, $fullWidth, $growOnHover }) => css`
        position: relative;
        overflow: scroll;
        width: ${$fullWidth ? "100%" : "max-content"};
        max-width: ${$maxWidth ? `${$maxWidth}px` : "100%"};
        padding: 0.5rem;
        background-color: color-mix(in srgb, ${theme.colors.background.dark}, #0000 40%);
        border: 1px solid color-mix(in srgb, ${theme.colors.border.dark}, #0000 40%);
        margin: 0.5em;
        transition: transform 0.1s ease-in-out;
        ${$growOnHover &&
        css`
            &:hover {
                transform: scale(1.04);
            }
        `}
    `}
`
