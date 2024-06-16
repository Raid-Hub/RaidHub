import { SVG, type SVGWrapperProps } from "../SVG"

export default function RedCircle(props: SVGWrapperProps) {
    return (
        <SVG viewBox="0 0 16 16" {...props}>
            <rect width="16" height="16" rx="8" fill="#E63030" fill-opacity="0.3" />
            <rect x="4" y="4" width="8" height="8" rx="4" fill="#E63030" />
        </SVG>
    )
}
