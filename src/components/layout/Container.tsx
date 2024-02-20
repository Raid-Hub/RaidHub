import styled from "styled-components"

export const Container = styled.div<{
    $minHeight?: number
    $aspectRatio?: {
        width: number
        height: number
    }
    $fullWidth?: boolean
}>`
    position: relative;
    ${({ $aspectRatio }) =>
        $aspectRatio ? `aspect-ratio: ${$aspectRatio.width}/${$aspectRatio.height};` : ""}
    ${({ $minHeight }) => ($minHeight ? `min-height: ${$minHeight}px;` : "")}
    ${({ $fullWidth }) => $fullWidth && `width: 100%;`}
`
