import { SVG, type SVGWrapperProps } from "../SVG"

export default function Checkmark({ color = "success", ...props }: SVGWrapperProps) {
    return (
        <SVG viewBox="0 0 32 32" color={color} {...props}>
            <polygon points="14 21.414 9 16.413 10.413 15 14 18.586 21.585 11 23 12.415 14 21.414" />
            <path d="M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,26A12,12,0,1,1,28,16,12,12,0,0,1,16,28Z" />
        </SVG>
    )
}
