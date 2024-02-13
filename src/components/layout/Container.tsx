import styled from "styled-components"

export const Container = styled.div<{
    $aspectRatio?: {
        width: number
        height: number
    }
    $fill?: boolean
}>`
    position: relative;
    ${({ $aspectRatio }) =>
        $aspectRatio ? `aspect-ratio: ${$aspectRatio.width}/${$aspectRatio.height};` : ""}
`
