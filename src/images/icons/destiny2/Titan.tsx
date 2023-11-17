import SVG, { SVGProps } from "~/components/reusable/SVG"

export default function Warlock(props: SVGProps) {
    return (
        <SVG xmlns="http://www.w3.org/2000/svg" viewBox="4 4 24 24" {...props}>
            <path d="m15.214 15.986-8.925-5.153v10.306zm1.572 0 8.925 5.153v-10.306zm8.109-5.629-8.856-5.193-8.896 5.17 8.896 5.136zm-.023 11.274-8.833-5.101-8.873 5.123 8.873 5.183z" />
        </SVG>
    )
}
