import { number } from "prop-types"

export default function numberWithCommas(clears: number) {
    return clears.toLocaleString("en")
}