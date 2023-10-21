import SVG, { SVGProps } from "~/components/reusable/SVG"

export default function Stopwatch(props: SVGProps) {
    return (
        <SVG viewBox="0 0 24 24" {...props}>
            <path
                d="M12 14V11M12 6C7.85786 6 4.5 9.35786 4.5 13.5C4.5 17.6421 7.85786 21 12 21C16.1421 21 19.5 17.6421 19.5 13.5C19.5 11.5561 18.7605 9.78494 17.5474 8.4525M12 6C14.1982 6 16.1756 6.94572 17.5474 8.4525M12 6V3M19.5 6.5L17.5474 8.4525M12 3H9M12 3H15"
                stroke={props.color}
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </SVG>
    )
}
