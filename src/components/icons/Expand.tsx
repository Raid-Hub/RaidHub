import { SVG, type SVGWrapperProps } from "../SVG"

export default function Expand(props: SVGWrapperProps) {
    return (
        <SVG viewBox="0 0 24 24" {...props}>
            <path d="M2,3V21a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V3a1,1,0,0,0-1-1H3A1,1,0,0,0,2,3ZM4,4H20V20H10V15a1,1,0,0,0-1-1H4ZM4,16H8v4H4Zm7.293-3.293a1,1,0,0,1,0-1.414L14.086,8.5H13a1,1,0,0,1,0-2h3.5a1,1,0,0,1,.923.618A1.01,1.01,0,0,1,17.5,7.5V11a1,1,0,0,1-2,0V9.914l-2.793,2.793a1,1,0,0,1-1.414,0Z" />
        </SVG>
    )
}
