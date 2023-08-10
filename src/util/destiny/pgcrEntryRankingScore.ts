import { round } from "../math"

export function pgcrEntryRankingScore({
    kills,
    assists,
    timePlayedSeconds,
    deaths
}: {
    kills: number
    deaths: number
    assists: number
    timePlayedSeconds: number
}) {
    // kills weighted 2x assists
    const killScore = (kills + 0.5 * assists) / Math.sqrt(round(timePlayedSeconds, -1))
    // a multiplier based on your time per deaths squared, normalized a bit
    const deathScore = (2 * timePlayedSeconds) / (deaths + 7) ** 2
    const timeScore = timePlayedSeconds / 360 // 10 points per hour

    return killScore * deathScore + timeScore
}
