import SVG, { SVGProps } from "~/components/reusable/SVG"

export default function Kill(props: SVGProps) {
    return (
        <SVG viewBox="0 0 32 32" {...props}>
            <path d="M28,8V7h-2v1H10v2H9c-0.552,0-1-0.448-1-1V8H6v1c0,0.448,0.106,0.87,0.283,1.253  C3.807,10.991,2,13.283,2,16v9h10v-5h3c1.654,0,3-1.346,3-3v-1h3v-2h9V8H28z M10,23H4v-7c0-2.206,1.794-4,4-4h2V23z M16,17  c0,0.552-0.448,1-1,1h-3c0-1.105,0.895-2,2-2h2V17z M28,12h-9v2h-5c-0.732,0-1.409,0.212-2,0.556V10h16V12z" />
        </SVG>
    )
}
