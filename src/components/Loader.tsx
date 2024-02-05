import styled, { keyframes } from "styled-components"

const spin = keyframes`
0% {
    transform: rotate(0deg);
}
100% {
    transform: rotate(360deg);
}`

export const Loader = styled.div<{ $stroke: number; $size?: string }>`
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;

    border: ${props => `${props.$stroke}px solid ${props.theme.colors.border.light}`};
    border-radius: 50%;
    border-top: ${props => props.$stroke}px solid ${props => props.theme.colors.brand.primary};

    -webkit-animation: ${spin} 2s linear infinite; /* Safari */
    animation: ${spin} 2s linear infinite;

    ${props =>
        props.$size
            ? `width: ${props.$size}; height: ${props.$size};`
            : `width: 100%; height: 100%;`}
    aspectratio: "1/1";
    padding: ${props => props.$stroke}px;
    position: "relative";
`
