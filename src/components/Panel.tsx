import styled, { css } from "styled-components"

export const Panel = styled.div<{
    $maxWidth?: number
}>`
    ${({ theme, $maxWidth }) => css`
        position: relative;
        width: ${$maxWidth ? "100%" : "max-content"};
        ${$maxWidth && ` max-width: ${$maxWidth}px;`}
        padding: 0.5rem;
        background-color: color-mix(in srgb, ${theme.colors.background.dark}, #0000 40%);
        border: 1px solid color-mix(in srgb, ${theme.colors.border.dark}, #0000 40%);
        margin: 0.5em;
    `}
`
