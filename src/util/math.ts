export function round(val: number, places: number): number {
    const factor = Math.pow(10, places);
    return Math.round(val * factor) / factor
}