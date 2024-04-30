import { SVG, type SVGWrapperProps } from "../SVG"

export default function Trophy(props: SVGWrapperProps) {
    return (
        <SVG
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 24 24"
            xmlSpace="preserve"
            {...props}
            fill="none">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 6C5.17157 6 4.5 6.67157 4.5 7.5C4.5 8.32843 5.17157 9 6 9L6 6ZM6 10.5C4.34315 10.5 3 9.15685 3 7.5C3 5.84315 4.34315 4.5 6 4.5H18C19.6569 4.5 21 5.84315 21 7.5C21 9.15685 19.6569 10.5 18 10.5V11.3308C18 13.9668 15.7097 16.142 12.75 16.46V18.75H15V20.25H9V18.75H11.25V16.46C8.29027 16.142 6 13.9668 6 11.3308L6 10.5ZM12 15C14.7029 15 16.5 13.1552 16.5 11.3308V6H7.5V11.3308C7.5 13.1552 9.29713 15 12 15ZM19.5 7.5C19.5 8.32843 18.8284 9 18 9V6C18.8284 6 19.5 6.67157 19.5 7.5Z"
            />
        </SVG>
    )
}
