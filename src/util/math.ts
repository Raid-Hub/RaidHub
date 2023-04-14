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

export function RGBAToHex(rgba: RGBA): string {
    const { red, green, blue, alpha } = rgba
    let r = red.toString(16)
    let g = green.toString(16)
    let b = blue.toString(16)
    let a = alpha.toString(16)

    if (r.length == 1) r = "0" + r
    if (g.length == 1) g = "0" + g
    if (b.length == 1) b = "0" + b
    if (a.length == 1) a = "0" + a

    return `#${r}${g}${b}${a}`
}

export async function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}
