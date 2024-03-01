"use client"

import styled, { css } from "styled-components"
import { SVG, type SVGWrapperProps } from "../SVG"

const DeepFilledSvg = styled(SVG)<{
    $fill?: string
    $hoverFill?: string
}>`
    ${({ $fill, $hoverFill }) => css`
        & path {
            fill: ${$fill};
        }

        & path:hover {
            fill: ${$hoverFill};
        }
    `}
`

export default function SpeedrunIcon({
    color,
    hoverColor,
    ...props
}: Omit<SVGWrapperProps, "ref">) {
    return (
        <DeepFilledSvg
            viewBox="0 -6.5 102 102"
            fillRule="evenodd"
            {...props}
            $fill={color}
            $hoverFill={hoverColor}>
            <g shapeRendering="crispEdges">
                <path
                    fill="#b55608"
                    d="M97.235 22.48h4.4v4.4h-4.4zM97.235 18.08h4.4v4.4h-4.4z"></path>
                <path
                    fill="#c36f09"
                    d="M97.235 13.68h4.4v4.4h-4.4zM97.235 9.28h4.4v4.4h-4.4zM97.235 4.87h4.4v4.4h-4.4z"></path>
                <path fill="#b55608" d="M92.825 26.89h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffecad"
                    d="M92.825 22.48h4.4v4.4h-4.4zM92.825 18.08h4.4v4.4h-4.4zM92.825 13.68h4.4v4.4h-4.4zM92.825 9.28h4.4v4.4h-4.4zM92.825 4.87h4.4v4.4h-4.4z"></path>
                <path fill="#c36f09" d="M92.825.47h4.4v4.4h-4.4zM88.425 31.29h4.4v4.4h-4.4z"></path>
                <path fill="#ffd95c" d="M88.425 26.89h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffc60a"
                    d="M88.425 22.48h4.4v4.4h-4.4zM88.425 9.28h4.4v4.4h-4.4z"></path>
                <path fill="#ffecad" d="M88.425 4.87h4.4v4.4h-4.4z"></path>
                <path fill="#c36f09" d="M88.425.47h4.4v4.4h-4.4zM84.025 35.69h4.4v4.4h-4.4z"></path>
                <path fill="#ffd95c" d="M84.025 31.29h4.4v4.4h-4.4z"></path>
                <path fill="#ffc60a" d="M84.025 26.89h4.4v4.4h-4.4z"></path>
                <path fill="#ffd95c" d="M84.025 9.28h4.4v4.4h-4.4z"></path>
                <path fill="#ffecad" d="M84.025 4.87h4.4v4.4h-4.4z"></path>
                <path fill="#b55608" d="M84.025.47h4.4v4.4h-4.4zM79.625 35.69h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffd95c"
                    d="M79.625 31.29h4.4v4.4h-4.4zM79.625 13.68h4.4v4.4h-4.4zM79.625 9.28h4.4v4.4h-4.4z"></path>
                <path fill="#b55608" d="M79.625 4.87h4.4v4.4h-4.4z"></path>
                <path
                    fill="#c36f09"
                    d="M75.215 40.1h4.4v4.4h-4.4zM75.215 35.69h4.4v4.4h-4.4zM75.215 31.29h4.4v4.4h-4.4zM75.215 26.89h4.4v4.4h-4.4zM75.215 22.48h4.4v4.4h-4.4zM75.215 18.08h4.4v4.4h-4.4zM75.215 13.68h4.4v4.4h-4.4zM75.215 9.28h4.4v4.4h-4.4zM75.215 4.87h4.4v4.4h-4.4z"></path>
                <path
                    fill="#710000"
                    d="M70.815 84.13h4.4v4.4h-4.4zM70.815 79.72h4.4v4.4h-4.4z"></path>
                <path fill="#c36f09" d="M70.815 44.5h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffe285"
                    d="M70.815 40.1h4.4v4.4h-4.4zM70.815 35.69h4.4v4.4h-4.4zM70.815 31.29h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffecad"
                    d="M70.815 26.89h4.4v4.4h-4.4zM70.815 22.48h4.4v4.4h-4.4zM70.815 18.08h4.4v4.4h-4.4zM70.815 13.68h4.4v4.4h-4.4zM70.815 9.28h4.4v4.4h-4.4zM70.815 4.87h4.4v4.4h-4.4z"></path>
                <path fill="#c36f09" d="M70.815.47h4.4v4.4h-4.4z"></path>
                <path fill="#710000" d="M66.415 84.13h4.4v4.4h-4.4z"></path>
                <path fill="#a63c06" d="M66.415 79.72h4.4v4.4h-4.4z"></path>
                <path fill="#710000" d="M66.415 75.32h4.4v4.4h-4.4z"></path>
                <path fill="#b55608" d="M66.415 48.9h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffe285"
                    d="M66.415 44.5h4.4v4.4h-4.4zM66.415 40.1h4.4v4.4h-4.4zM66.415 35.69h4.4v4.4h-4.4zM66.415 31.29h4.4v4.4h-4.4zM66.415 26.89h4.4v4.4h-4.4zM66.415 22.48h4.4v4.4h-4.4zM66.415 18.08h4.4v4.4h-4.4zM66.415 13.68h4.4v4.4h-4.4zM66.415 9.28h4.4v4.4h-4.4z"></path>
                <path fill="#ffecad" d="M66.415 4.87h4.4v4.4h-4.4z"></path>
                <path fill="#c36f09" d="M66.415.47h4.4v4.4h-4.4z"></path>
                <path fill="#710000" d="M62.005 84.13h4.4v4.4h-4.4z"></path>
                <path fill="#a63c06" d="M62.005 79.72h4.4v4.4h-4.4z"></path>
                <path fill="#da914d" d="M62.005 75.32h4.4v4.4h-4.4z"></path>
                <path fill="#710000" d="M62.005 70.92h4.4v4.4h-4.4z"></path>
                <path fill="#b55608" d="M62.005 53.31h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffe285"
                    d="M62.005 48.9h4.4v4.4h-4.4zM62.005 44.5h4.4v4.4h-4.4zM62.005 40.1h4.4v4.4h-4.4zM62.005 35.69h4.4v4.4h-4.4zM62.005 31.29h4.4v4.4h-4.4zM62.005 26.89h4.4v4.4h-4.4zM62.005 22.48h4.4v4.4h-4.4zM62.005 18.08h4.4v4.4h-4.4zM62.005 13.68h4.4v4.4h-4.4zM62.005 9.28h4.4v4.4h-4.4zM62.005 4.87h4.4v4.4h-4.4z"></path>
                <path fill="#c36f09" d="M62.005.47h4.4v4.4h-4.4z"></path>
                <path fill="#710000" d="M57.605 84.13h4.4v4.4h-4.4z"></path>
                <path fill="#c36f09" d="M57.605 79.72h4.4v4.4h-4.4z"></path>
                <path fill="#da914d" d="M57.605 75.32h4.4v4.4h-4.4z"></path>
                <path fill="#710000" d="M57.605 70.92h4.4v4.4h-4.4z"></path>
                <path
                    fill="#b55608"
                    d="M57.605 66.52h4.4v4.4h-4.4zM57.605 62.11h4.4v4.4h-4.4zM57.605 57.71h4.4v4.4h-4.4zM57.605 53.31h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffe285"
                    d="M57.605 48.9h4.4v4.4h-4.4zM57.605 44.5h4.4v4.4h-4.4zM57.605 40.1h4.4v4.4h-4.4zM57.605 35.69h4.4v4.4h-4.4zM57.605 31.29h4.4v4.4h-4.4zM57.605 26.89h4.4v4.4h-4.4zM57.605 22.48h4.4v4.4h-4.4zM57.605 18.08h4.4v4.4h-4.4zM57.605 13.68h4.4v4.4h-4.4zM57.605 9.28h4.4v4.4h-4.4zM57.605 4.87h4.4v4.4h-4.4z"></path>
                <path fill="#c36f09" d="M57.605.47h4.4v4.4h-4.4z"></path>
                <path fill="#710000" d="M53.205 84.13h4.4v4.4h-4.4z"></path>
                <path fill="#da914d" d="M53.205 79.72h4.4v4.4h-4.4z"></path>
                <path fill="#c36f09" d="M53.205 75.32h4.4v4.4h-4.4z"></path>
                <path fill="#710000" d="M53.205 70.92h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffe285"
                    d="M53.205 66.52h4.4v4.4h-4.4zM53.205 62.11h4.4v4.4h-4.4zM53.205 57.71h4.4v4.4h-4.4z"></path>
                <path fill="#b55608" d="M53.205 53.31h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffd95c"
                    d="M53.205 48.9h4.4v4.4h-4.4zM53.205 44.5h4.4v4.4h-4.4zM53.205 40.1h4.4v4.4h-4.4zM53.205 35.69h4.4v4.4h-4.4zM53.205 31.29h4.4v4.4h-4.4zM53.205 26.89h4.4v4.4h-4.4zM53.205 22.48h4.4v4.4h-4.4zM53.205 18.08h4.4v4.4h-4.4zM53.205 13.68h4.4v4.4h-4.4zM53.205 9.28h4.4v4.4h-4.4zM53.205 4.87h4.4v4.4h-4.4z"></path>
                <path fill="#b55608" d="M53.205.47h4.4v4.4h-4.4z"></path>
                <path fill="#710000" d="M48.795 84.13h4.4v4.4h-4.4z"></path>
                <path fill="#da914d" d="M48.795 79.72h4.4v4.4h-4.4z"></path>
                <path fill="#c36f09" d="M48.795 75.32h4.4v4.4h-4.4z"></path>
                <path fill="#710000" d="M48.795 70.92h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffd95c"
                    d="M48.795 66.52h4.4v4.4h-4.4zM48.795 62.11h4.4v4.4h-4.4zM48.795 57.71h4.4v4.4h-4.4z"></path>
                <path fill="#b55608" d="M48.795 53.31h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffd95c"
                    d="M48.795 48.9h4.4v4.4h-4.4zM48.795 44.5h4.4v4.4h-4.4zM48.795 40.1h4.4v4.4h-4.4zM48.795 35.69h4.4v4.4h-4.4zM48.795 31.29h4.4v4.4h-4.4zM48.795 26.89h4.4v4.4h-4.4zM48.795 22.48h4.4v4.4h-4.4zM48.795 18.08h4.4v4.4h-4.4zM48.795 13.68h4.4v4.4h-4.4zM48.795 9.28h4.4v4.4h-4.4zM48.795 4.87h4.4v4.4h-4.4z"></path>
                <path fill="#b55608" d="M48.795.47h4.4v4.4h-4.4z"></path>
                <path fill="#710000" d="M44.395 84.13h4.4v4.4h-4.4z"></path>
                <path fill="#da914d" d="M44.395 79.72h4.4v4.4h-4.4z"></path>
                <path fill="#c36f09" d="M44.395 75.32h4.4v4.4h-4.4z"></path>
                <path fill="#710000" d="M44.395 70.92h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffcf33"
                    d="M44.395 66.52h4.4v4.4h-4.4zM44.395 62.11h4.4v4.4h-4.4zM44.395 57.71h4.4v4.4h-4.4z"></path>
                <path fill="#b55608" d="M44.395 53.31h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffd95c"
                    d="M44.395 48.9h4.4v4.4h-4.4zM44.395 44.5h4.4v4.4h-4.4zM44.395 40.1h4.4v4.4h-4.4zM44.395 35.69h4.4v4.4h-4.4zM44.395 31.29h4.4v4.4h-4.4zM44.395 26.89h4.4v4.4h-4.4zM44.395 22.48h4.4v4.4h-4.4zM44.395 18.08h4.4v4.4h-4.4zM44.395 13.68h4.4v4.4h-4.4zM44.395 9.28h4.4v4.4h-4.4zM44.395 4.87h4.4v4.4h-4.4z"></path>
                <path fill="#b55608" d="M44.395.47h4.4v4.4h-4.4z"></path>
                <path fill="#710000" d="M39.995 84.13h4.4v4.4h-4.4z"></path>
                <path fill="#c36f09" d="M39.995 79.72h4.4v4.4h-4.4z"></path>
                <path fill="#da914d" d="M39.995 75.32h4.4v4.4h-4.4z"></path>
                <path fill="#710000" d="M39.995 70.92h4.4v4.4h-4.4z"></path>
                <path
                    fill="#b55608"
                    d="M39.995 66.52h4.4v4.4h-4.4zM39.995 62.11h4.4v4.4h-4.4zM39.995 57.71h4.4v4.4h-4.4zM39.995 53.31h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffcf33"
                    d="M39.995 48.9h4.4v4.4h-4.4zM39.995 44.5h4.4v4.4h-4.4zM39.995 40.1h4.4v4.4h-4.4zM39.995 35.69h4.4v4.4h-4.4zM39.995 31.29h4.4v4.4h-4.4zM39.995 26.89h4.4v4.4h-4.4zM39.995 22.48h4.4v4.4h-4.4zM39.995 18.08h4.4v4.4h-4.4zM39.995 13.68h4.4v4.4h-4.4zM39.995 9.28h4.4v4.4h-4.4zM39.995 4.87h4.4v4.4h-4.4z"></path>
                <path fill="#b55608" d="M39.995.47h4.4v4.4h-4.4z"></path>
                <path fill="#710000" d="M35.585 84.13h4.4v4.4h-4.4z"></path>
                <path fill="#a63c06" d="M35.585 79.72h4.4v4.4h-4.4z"></path>
                <path fill="#da914d" d="M35.585 75.32h4.4v4.4h-4.4z"></path>
                <path fill="#710000" d="M35.585 70.92h4.4v4.4h-4.4z"></path>
                <path fill="#b55608" d="M35.585 53.31h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffc60a"
                    d="M35.585 48.9h4.4v4.4h-4.4zM35.585 44.5h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffcf33"
                    d="M35.585 40.1h4.4v4.4h-4.4zM35.585 35.69h4.4v4.4h-4.4zM35.585 31.29h4.4v4.4h-4.4zM35.585 26.89h4.4v4.4h-4.4zM35.585 22.48h4.4v4.4h-4.4zM35.585 18.08h4.4v4.4h-4.4zM35.585 13.68h4.4v4.4h-4.4zM35.585 9.28h4.4v4.4h-4.4zM35.585 4.87h4.4v4.4h-4.4z"></path>
                <path fill="#b55608" d="M35.585.47h4.4v4.4h-4.4z"></path>
                <path fill="#710000" d="M31.185 84.13h4.4v4.4h-4.4z"></path>
                <path fill="#a63c06" d="M31.185 79.72h4.4v4.4h-4.4z"></path>
                <path fill="#710000" d="M31.185 75.32h4.4v4.4h-4.4z"></path>
                <path fill="#b55608" d="M31.185 48.9h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffc60a"
                    d="M31.185 44.5h4.4v4.4h-4.4zM31.185 40.1h4.4v4.4h-4.4zM31.185 35.69h4.4v4.4h-4.4zM31.185 31.29h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffcf33"
                    d="M31.185 26.89h4.4v4.4h-4.4zM31.185 22.48h4.4v4.4h-4.4zM31.185 18.08h4.4v4.4h-4.4zM31.185 13.68h4.4v4.4h-4.4zM31.185 9.28h4.4v4.4h-4.4zM31.185 4.87h4.4v4.4h-4.4z"></path>
                <path fill="#b55608" d="M31.185.47h4.4v4.4h-4.4z"></path>
                <path
                    fill="#710000"
                    d="M26.785 84.13h4.4v4.4h-4.4zM26.785 79.72h4.4v4.4h-4.4z"></path>
                <path fill="#b55608" d="M26.785 44.5h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffc60a"
                    d="M26.785 40.1h4.4v4.4h-4.4zM26.785 35.69h4.4v4.4h-4.4zM26.785 31.29h4.4v4.4h-4.4zM26.785 26.89h4.4v4.4h-4.4zM26.785 22.48h4.4v4.4h-4.4zM26.785 18.08h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffcf33"
                    d="M26.785 13.68h4.4v4.4h-4.4zM26.785 9.28h4.4v4.4h-4.4zM26.785 4.87h4.4v4.4h-4.4z"></path>
                <path
                    fill="#b55608"
                    d="M26.785.47h4.4v4.4h-4.4zM22.385 40.1h4.4v4.4h-4.4zM22.385 35.69h4.4v4.4h-4.4zM22.385 31.29h4.4v4.4h-4.4zM22.385 26.89h4.4v4.4h-4.4zM22.385 22.48h4.4v4.4h-4.4zM22.385 18.08h4.4v4.4h-4.4zM22.385 13.68h4.4v4.4h-4.4zM22.385 9.28h4.4v4.4h-4.4z"></path>
                <path fill="#c36f09" d="M22.385 4.87h4.4v4.4h-4.4z"></path>
                <path fill="#b55608" d="M17.975 35.69h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffcf33"
                    d="M17.975 31.29h4.4v4.4h-4.4zM17.975 13.68h4.4v4.4h-4.4z"></path>
                <path fill="#ffe285" d="M17.975 9.28h4.4v4.4h-4.4z"></path>
                <path fill="#c36f09" d="M17.975 4.87h4.4v4.4h-4.4z"></path>
                <path fill="#b55608" d="M13.575 35.69h4.4v4.4h-4.4z"></path>
                <path fill="#ffc60a" d="M13.575 31.29h4.4v4.4h-4.4z"></path>
                <path fill="#ffe285" d="M13.575 26.89h4.4v4.4h-4.4z"></path>
                <path fill="#ffcf33" d="M13.575 9.28h4.4v4.4h-4.4z"></path>
                <path fill="#ffe285" d="M13.575 4.87h4.4v4.4h-4.4z"></path>
                <path fill="#c36f09" d="M13.575.47h4.4v4.4h-4.4z"></path>
                <path fill="#b55608" d="M9.175 31.29h4.4v4.4h-4.4z"></path>
                <path fill="#ffc60a" d="M9.175 26.89h4.4v4.4h-4.4z"></path>
                <path fill="#ffe285" d="M9.175 22.48h4.4v4.4h-4.4z"></path>
                <path fill="#ffcf33" d="M9.175 9.28h4.4v4.4h-4.4z"></path>
                <path fill="#ffe285" d="M9.175 4.87h4.4v4.4h-4.4z"></path>
                <path fill="#c36f09" d="M9.175.47h4.4v4.4h-4.4z"></path>
                <path fill="#b55608" d="M4.765 26.89h4.4v4.4h-4.4z"></path>
                <path fill="#ffc60a" d="M4.765 22.48h4.4v4.4h-4.4z"></path>
                <path
                    fill="#ffcf33"
                    d="M4.765 18.08h4.4v4.4h-4.4zM4.765 13.68h4.4v4.4h-4.4zM4.765 9.28h4.4v4.4h-4.4z"></path>
                <path fill="#ffe285" d="M4.765 4.87h4.4v4.4h-4.4z"></path>
                <path
                    fill="#b55608"
                    d="M4.765.47h4.4v4.4h-4.4zM.365 22.48h4.4v4.4h-4.4zM.365 18.08h4.4v4.4h-4.4zM.365 13.68h4.4v4.4h-4.4zM.365 9.28h4.4v4.4h-4.4zM.365 4.87h4.4v4.4h-4.4z"></path>
            </g>
        </DeepFilledSvg>
    )
}
