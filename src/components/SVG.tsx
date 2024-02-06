"use client"

import React from "react"
import styled, { DefaultTheme } from "styled-components"
import { AtLeast } from "~/types/generic"

export type SVGWrapperProps = Omit<
    {
        sx?: number
        color?: keyof DefaultTheme["colors"]["icon"]
        hoverColor?: keyof DefaultTheme["colors"]["icon"]
        absolute?: boolean
    } & React.SVGProps<SVGSVGElement>,
    "className"
>

export type SVGComponent = (props: SVGWrapperProps) => JSX.Element

interface StyledSvgProps {
    $sx?: number
    $color?: keyof DefaultTheme["colors"]["icon"]
    $hoverColor?: keyof DefaultTheme["colors"]["icon"]
    $absolute?: boolean
}
const StyledSvg = styled.svg<StyledSvgProps>`
    aspect-ratio: 1/1;
    ${({ $absolute }) => $absolute && "position: absolute;"}
    width: ${({ $sx }) => `${$sx}px`};
    fill: ${({ theme, $color }) => theme.colors.icon[$color ?? "white"]};

    ${({ theme, $hoverColor }) =>
        $hoverColor && theme.colors.icon[$hoverColor]
            ? `&:hover {fill: ${theme.colors.icon[$hoverColor]};}`
            : ""}
`
StyledSvg.defaultProps = {
    $sx: 24,
    $color: "white"
}

export function SVG({
    sx,
    color,
    hoverColor,
    children,
    absolute,
    ...restOfProps
}: SVGWrapperProps & AtLeast<React.SVGProps<SVGSVGElement>, "viewBox">) {
    return (
        <StyledSvg
            $sx={sx}
            $color={color}
            $hoverColor={hoverColor}
            $absolute={absolute}
            width={sx}
            xmlns="http://www.w3.org/2000/svg"
            {...restOfProps}>
            {children}
        </StyledSvg>
    )
}
