import styled, { css } from "styled-components"

export const Container = styled.div<{
    $minHeight?: number
    $aspectRatio?: {
        width: number
        height: number
    }
    $fullWidth?: boolean
    $flex?: boolean
}>`
    position: relative;
    ${({ $aspectRatio, $minHeight, $fullWidth, $flex }) => css`
        ${$aspectRatio ? `aspect-ratio: ${$aspectRatio.width}/${$aspectRatio.height};` : ""}
        ${$minHeight ? `min-height: ${$minHeight}px;` : ""}
        ${$fullWidth ? `width: 100%;` : ""}
        ${$flex ? `display: flex; justify-content: center; align-items: center` : ""}
    `}
`
