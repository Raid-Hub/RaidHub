import { RGBA } from "~/types/generic"
import { o } from "../o"

/**
 * Useful for clan banners since bungie gives us the RGBA values as their own properties
 * @param rgba a list of the rgba values
 * @returns a hex string with #
 */
export function RGBAToHex(rgba: RGBA | null): string {
    if (!rgba) return "#00000000"

    const hex = o.fromEntries(
        o.map(rgba, (channel, value) => [channel, value.toString(16).padStart(2, "0")])
    )

    return `#${hex.red}${hex.green}${hex.blue}${hex.alpha}`
}
