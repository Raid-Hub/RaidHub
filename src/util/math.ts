import { RGBA } from "./types"

export function round(val: number, places: number): number {
    const factor = Math.pow(10, places)
    return Math.round(val * factor) / factor
}

export function median(sortedArr: number[]): number {
    const mid = (sortedArr.length - 1) / 2
    if (mid % 1 === 0) {
        return sortedArr[mid]
    } else {
        return (sortedArr[Math.floor(mid)] + sortedArr[Math.ceil(mid)]) / 2
    }
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

export async function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
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
