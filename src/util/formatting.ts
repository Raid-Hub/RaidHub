import { RGBA } from "./types"

const locale = () => global.locale;

export function formattedNumber(num: number): string {
    return num.toLocaleString(locale())
}

export function toCustomDateString(date: Date): string {
    return date.toLocaleDateString(locale(), {
        month: "long",
        day: "numeric",
        year: "numeric"
    })
}

/**
 * Since Bungie decided to make the code a number, leading zeroes get truncated (lol)
 * @param code the potentially bad code
 * @returns a 4 digit string with zeroes added
 */
export function fixBungieCode(code: number): string {
    const str = code.toString()
    const missingZeroes = 4 - str.length
    return `${"0".repeat(missingZeroes)}${str}`
}

/**
 * Destiny clan names are unique, so players often include blank characters in their name,
 * so let's just remove them using left and right pointers
 * @param name the name of the clan
 * @returns the fixed clan name
 */
export function fixClanName(name: string): string {
    const blanks = ["ㅤ", "ㅤ", " "]
    let r = name.length
    while (r > 0) {
        if (blanks.includes(name[r - 1])) r--
        else break
    }

    let l = 0
    while (l < name.length) {
        if (blanks.includes(name[l])) l++
        else break
    }
    return name.substring(l, r)
}

/**
 *
 * @param name Turns a string into a bungie name
 * @returns
 */
export function asBungieName(name: string): [name: string, code: number] | undefined {
    if (name.includes("#")) {
        const [nameStr, code] = name.split("#")
        const codeNum = parseInt(code)
        if (nameStr && !isNaN(codeNum)) {
            return [nameStr, codeNum]
        }
    }
    return undefined
}

export function secondsToHMS(seconds: number): string {
    let time = Math.round(seconds)
    const hours = Math.floor(time / 3600)
    time -= hours * 3600
    const minutes = Math.floor(time / 60)
    time -= minutes * 60
    return `${hours ? hours + "h" : ""} ${hours | minutes ? minutes + "m" : ""} ${time + "s"}`
}

/**
 * Useful for clan banners since bungie gives us the RGBA values as their own properties
 * @param rgba a list of the rgba values
 * @returns a hex string with #
 */
export function RGBAToHex(rgba: RGBA): string {
    const { red, green, blue, alpha } = rgba
    let r = red.toString(16)
    let g = green.toString(16)
    let b = blue.toString(16)
    let a = alpha.toString(16)

    if (r.length === 1) r = `0${r}`
    if (g.length === 1) g = `0${g}`
    if (b.length === 1) b = `0${b}`
    if (a.length === 1) a = `0${a}`

    return `#${r}${g}${b}${a}`
}
