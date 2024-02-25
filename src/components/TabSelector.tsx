import styled from "styled-components"
import { Flex } from "./layout/Flex"

export const TabSelector = styled(Flex)`
    & [aria-selected] {
        border-bottom: 1.5px solid ${props => props.theme.colors.border.dark};
        transition: border 150ms ease-in;
    }
    & [aria-selected="true"] {
        border-bottom: 1.5px solid ${props => props.theme.colors.brand.primary};
    }
    & > * {
        cursor: pointer;
    }
`

TabSelector.defaultProps = {
    $gap: 0,
    $direction: "row",
    $align: "flex-start",
    $crossAxis: "stretch"
}
