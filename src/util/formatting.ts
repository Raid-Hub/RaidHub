const locale = () => navigator.language

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
