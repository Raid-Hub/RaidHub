import { SVG, type SVGWrapperProps } from "../SVG"

export default function Hunter(props: SVGWrapperProps) {
    return (
        <SVG xmlns="http://www.w3.org/2000/svg" viewBox="4 4 24 24" {...props}>
            <path d="m11.297 12.239 4.703-.016-4.705 7.078 4.705-.016-5.02 7.551h-4.77l4.764-7.062h-4.764l4.762-7.059h-4.762l5.083-7.534 4.707-.017zm9.406 0-4.703-7.075 4.707.017 5.083 7.534h-4.762l4.762 7.059h-4.764l4.764 7.062h-4.77l-5.02-7.551 4.705.016-4.705-7.078z" />
        </SVG>
    )
}
