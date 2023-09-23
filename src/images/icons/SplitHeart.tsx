import SVG, { SVGProps } from "~/components/reusable/SVG"

export default function SplitHeart(props: SVGProps) {
    return (
        <SVG viewBox="0 0 24 24" {...props}>
            <path
                d="M12 20V5.99995M12 5.99995C10.2006 3.90293 7.19377 3.25485 4.93923 5.17509C2.68468 7.09533 2.36727 10.3059 4.13778 12.577C5.60984 14.4652 10.0648 18.4477 11.5249 19.7366C11.6882 19.8808 11.7699 19.9529 11.8652 19.9813C11.9483 20.006 12.0393 20.006 12.1225 19.9813C12.2178 19.9529 12.2994 19.8808 12.4628 19.7366C13.9229 18.4477 18.3778 14.4652 19.8499 12.577C21.6204 10.3059 21.3417 7.07513 19.0484 5.17509C16.7551 3.27505 13.7994 3.90293 12 5.99995Z"
                stroke={props.color}
                fill="none"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </SVG>
    )
}
