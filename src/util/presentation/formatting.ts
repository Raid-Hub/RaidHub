import { round } from "../math"

export function formattedNumber(num: number, locale: string): string {
    return round(num, 2).toLocaleString(locale)
}

export function toCustomDateString(date: Date, locale: string): string {
    return date.toLocaleDateString(locale, {
        month: "long",
        day: "numeric",
        year: "numeric"
    })
}

export function secondsToHMS(seconds: number, alwaysIncludeSeconds: boolean = false): string {
    let time = Math.round(seconds)
    const hours = Math.floor(time / 3600)
    time -= hours * 3600
    const minutes = Math.floor(time / 60)
    time -= minutes * 60
    return `${hours ? hours + "h" : ""} ${hours || minutes ? minutes + "m" : ""}${
        !hours || alwaysIncludeSeconds ? ` ${time + "s"}` : ""
    }`
}
