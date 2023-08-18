import { round } from "../math"

export function pgcrEntryRankingScore({
    kills,
    assists,
    timePlayedSeconds,
    deaths,
    precisionKills,
    superKills
}: {
    kills: number
    deaths: number
    assists: number
    timePlayedSeconds: number
    precisionKills: number
    superKills: number
}) {
    // kills weighted 2x assists
    const killScore = (kills + 0.5 * assists) / Math.sqrt(round(timePlayedSeconds, -1))
    // a multiplier based on your time per deaths squared, normalized a bit
    const deathScore = (2 * timePlayedSeconds) / (deaths + 7) ** 2

    const primaryScore = killScore * deathScore

    const timeScore = timePlayedSeconds / 360 // 10 points per hour

    const precisionScore = (precisionKills / kills) * 10 // 1 point per 10% of kills

    const superScore = (superKills / (timePlayedSeconds / 60)) * 5 // 1 point per super kill per minute

    const finalScore = primaryScore + timeScore + precisionScore + superScore

    return finalScore
}
