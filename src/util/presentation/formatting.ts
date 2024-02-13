import { round } from "../math"

export function formattedNumber(num: number, locale: string): string {
    return round(num, 2).toLocaleString(locale)
}

export function truncatedNumber(num: number): string {
    if (num < 1000) {
        return num.toString()
    } else if (num < 1000000) {
        return Math.floor(num / 1000) + "k"
    } else {
        return Math.floor(num / 1000000) + "M"
    }
}

export function toCustomDateString(date: Date, locale: string): string {
    return date.toLocaleDateString(locale, {
        month: "long",
        day: "numeric",
        year: "numeric"
    })
}
export function formattedTimeSince(date: Date, locale: string | undefined = undefined): string {
    const now = new Date()
    const secondsPast = Math.floor((now.getTime() - date.getTime()) / 1000)

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })

    if (secondsPast < 60) {
        return rtf.format(-secondsPast, "second")
    }
    if (secondsPast < 3600) {
        return rtf.format(-Math.floor(secondsPast / 60), "minute")
    }
    if (secondsPast < 86400) {
        return rtf.format(-Math.floor(secondsPast / 3600), "hour")
    }
    if (secondsPast < 2592000) {
        return rtf.format(-Math.floor(secondsPast / 86400), "day")
    }
    if (secondsPast < 31536000) {
        return rtf.format(-Math.floor(secondsPast / 2592000), "month")
    }
    return rtf.format(-Math.floor(secondsPast / 31536000), "year")
}

export function secondsToHMS(seconds: number, alwaysIncludeSeconds: boolean): string {
    let time = Math.round(seconds)
    const hours = Math.floor(time / 3600)
    time -= hours * 3600
    const minutes = Math.floor(time / 60)
    time -= minutes * 60
    return `${hours ? hours + "h" : ""} ${hours || minutes ? minutes + "m" : ""}${
        !hours || alwaysIncludeSeconds ? ` ${time + "s"}` : ""
    }`
}

export function secondsToYDHMS(totalSeconds: number): string {
    let time = Math.round(totalSeconds)
    const seconds = time % 60
    time -= seconds
    time /= 60

    const minutes = time % 60
    time -= minutes
    time /= 60

    const hours = time % 24
    time -= hours
    time /= 24

    const days = time % 365
    time -= days
    time /= 365

    const years = time
    return [
        years ? years + "y" : "",
        days ? days + "d" : "",
        hours ? hours + "h" : "",
        minutes ? minutes + "m" : "",
        seconds ? seconds + "s" : ""
    ]
        .filter(Boolean)
        .join(" ")
}

const domParser = typeof window !== "undefined" ? new DOMParser() : null
export const decodeHtmlEntities = (html: string) => {
    if (typeof window === "undefined") return html
    const doc = domParser!.parseFromString(html, "text/html")
    return doc.body.textContent ?? ""
}
