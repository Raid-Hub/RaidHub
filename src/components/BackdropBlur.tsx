import styled from "styled-components"

export const BackdropBlur = styled.div<{
    $radius: number
}>`
    top: 0;
    left: 0;
    z-index: -1;
    position: absolute;
    width: 100%;
    height: 100%;

    backdrop-filter: blur(${({ $radius }) => $radius}px);
`
