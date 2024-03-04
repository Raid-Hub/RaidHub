import { SVG, type SVGWrapperProps } from "../SVG"

export default function Search(props: SVGWrapperProps) {
    return (
        <SVG viewBox="0 0 24 24" {...props}>
            <g opacity="0.2">
                <path
                    opacity="0.3"
                    d="M14.2929 16.7071C13.9024 16.3166 13.9024 15.6834 14.2929 15.2929C14.6834 14.9024 15.3166 14.9024 15.7071 15.2929L19.7071 19.2929C20.0976 19.6834 20.0976 20.3166 19.7071 20.7071C19.3166 21.0976 18.6834 21.0976 18.2929 20.7071L14.2929 16.7071Z"
                    fill="#FAFAFA"
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4 11C4 14.866 7.13401 18 11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11ZM16 11C16 13.7614 13.7614 16 11 16C8.23858 16 6 13.7614 6 11C6 8.23858 8.23858 6 11 6C13.7614 6 16 8.23858 16 11Z"
                    fill="#FAFAFA"
                />
            </g>
        </SVG>
    )
}
