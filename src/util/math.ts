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
