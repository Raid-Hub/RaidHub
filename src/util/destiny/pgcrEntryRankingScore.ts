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
    // kills weighted 2x assists, slight diminishing returns
    const killScore = (kills + 0.5 * assists) ** 0.95 / Math.sqrt(round(timePlayedSeconds, -1))
    // a multiplier based on your time per deaths squared, normalized a bit by using deaths + 7
    const deathScore = (2 * timePlayedSeconds) / (deaths + 7) ** 2

    const timeScore = timePlayedSeconds / 360 // 10 points per hour

    const precisionScore = (precisionKills / kills) * 10 // 1 point per 10% of kills

    const superScore = (superKills / (timePlayedSeconds / 60)) * 5 // 1 point per super kill per minute

    const finalScore = killScore * deathScore + timeScore + precisionScore + superScore

    console.table({
        killScore,
        deathScore,
        timeScore,
        precisionScore,
        superScore,
        finalScore
    })

    return finalScore
}
