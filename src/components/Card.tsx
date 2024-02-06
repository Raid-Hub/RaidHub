import styled from "styled-components"

export const Card = styled.div`
    background-color: color-mix(
        in srgb,
        ${props => props.theme.colors.background.medium},
        #0000 75%
    );
    border-radius: 10px;
    border: 1px solid color-mix(in srgb, ${props => props.theme.colors.border.dark}, #0000 60%);
`
