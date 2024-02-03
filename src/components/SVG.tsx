import React from "react"
import styled, { DefaultTheme } from "styled-components"
import { AtLeast } from "~/types/generic"

export type SVGWrapperProps = Omit<
    {
        sx?: number
        color?: string
    } & React.SVGProps<SVGSVGElement>,
    "className"
>

export type SVGComponent = (props: SVGWrapperProps) => JSX.Element

interface StyledSvgProps {
    $sx?: number
    $color?: string
    $iconId?: keyof DefaultTheme["socials"]
}
const StyledSvg = styled.svg<StyledSvgProps>`
    aspect-ratio: 1/1;
    fill: ${({ $color }) => $color};
    width: ${({ $sx }) => `${$sx}px`};
    ${({ theme, $iconId }) =>
        $iconId && theme.socials[$iconId] ? `&:hover fill: ${theme.socials[$iconId]};` : ""}
`
StyledSvg.defaultProps = {
    $sx: 24,
    $color: "white"
}

export function SVG({
    sx,
    color,
    iconId,
    children,
    ...restOfProps
}: {
    sx?: number
    color?: string
    iconId?: keyof DefaultTheme["socials"]
} & AtLeast<React.SVGProps<SVGSVGElement>, "viewBox">) {
    return (
        <StyledSvg
            $sx={sx}
            $iconId={iconId}
            $color={color}
            data-icon-id={iconId}
            width={sx}
            xmlns="http://www.w3.org/2000/svg"
            {...restOfProps}>
            {children}
        </StyledSvg>
    )
}
