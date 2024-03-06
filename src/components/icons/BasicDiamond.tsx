import { SVG, type SVGWrapperProps } from "../SVG"

export default function BasicDiamond(props: SVGWrapperProps) {
    return (
        <SVG viewBox="0 2 20 20" {...props}>
            <path d="M16,5.78,18.58,8.4a1,1,0,0,1,.05,1.36l-7.88,9a1,1,0,0,1-1.5,0l-7.88-9a1,1,0,0,1,0-1.36L4,5.78a1,1,0,0,1,.7-.29H15.26A1,1,0,0,1,16,5.78Z" />
        </SVG>
    )
}
