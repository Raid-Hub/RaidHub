import { round } from "../math"

export function pgcrEntryRankingScore({
    kills,
    assists,
    timePlayedSeconds,
    deaths,
    precisionKills,
    superKills,
    didComplete
}: {
    kills: number
    deaths: number
    assists: number
    timePlayedSeconds: number
    precisionKills: number
    superKills: number
    didComplete: boolean
}) {
    const adjustedTimePlayedSeconds = timePlayedSeconds || 1
    // kills weighted 2x assists, slight diminishing returns
    const killScore =
        (kills + 0.5 * assists) ** 0.95 / Math.sqrt(round(adjustedTimePlayedSeconds, -1) || 1)
    // a multiplier based on your time per deaths squared, normalized a bit by using deaths + 7
    const deathScore = (2 * adjustedTimePlayedSeconds) / (deaths + 7) ** 2

    const timeScore = adjustedTimePlayedSeconds / 360 // 10 points per hour

    const precisionScore = (precisionKills / (kills || 1)) * 10 // 1 point per 10% of kills

    const superScore = (superKills / (adjustedTimePlayedSeconds / 60)) * 5 // 1 point per super kill per minute

    const completionScore = didComplete ? 1 : 0.5

    const finalScore =
        (killScore * deathScore + timeScore + precisionScore + superScore) * completionScore

    return finalScore
}
