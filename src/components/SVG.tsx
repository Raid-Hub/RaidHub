"use client"

import type { SVGProps } from "react"
import styled, { type DefaultTheme } from "styled-components"
import type { AtLeast } from "~/types/generic"

export type SVGWrapperProps = Omit<
    {
        sx?: number
        color?: keyof DefaultTheme["colors"]["icon"]
        hoverColor?: keyof DefaultTheme["colors"]["icon"]
        absolute?: boolean
        pointer?: boolean
    } & SVGProps<SVGSVGElement>,
    "className"
>

export type SVGComponent = (props: SVGWrapperProps) => JSX.Element

interface StyledSvgProps {
    $sx?: number
    $color?: keyof DefaultTheme["colors"]["icon"]
    $hoverColor?: keyof DefaultTheme["colors"]["icon"]
    $absolute?: boolean
    $pointer?: boolean
}
const StyledSvg = styled.svg<StyledSvgProps>`
    aspect-ratio: 1/1;
    ${({ $pointer }) => $pointer && "cursor: pointer"};
    ${({ $absolute }) => $absolute && "position: absolute;"}
    ${({ $sx }) => $sx !== undefined && `width: ${$sx}px;`}
    fill: ${({ theme, $color }) => theme.colors.icon[$color ?? "white"]};

    ${({ theme, $hoverColor }) =>
        $hoverColor && theme.colors.icon[$hoverColor]
            ? `&:hover:not([aria-disabled="true"]) {fill: ${theme.colors.icon[$hoverColor]};}`
            : ""}
`
StyledSvg.defaultProps = {
    $color: "white"
}

export function SVG({
    sx,
    color,
    hoverColor,
    children,
    absolute,
    pointer,
    ...restOfProps
}: SVGWrapperProps & AtLeast<React.SVGProps<SVGSVGElement>, "viewBox">) {
    return (
        <StyledSvg
            $sx={sx}
            $color={color}
            $hoverColor={hoverColor}
            $absolute={absolute}
            $pointer={pointer}
            width={sx}
            xmlns="http://www.w3.org/2000/svg"
            {...restOfProps}>
            {children}
        </StyledSvg>
    )
}
