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
    const killScore = ((kills + 0.5 * assists) / Math.sqrt(timePlayedSeconds)) * 1000
    // a multiplier based on your deaths per 5 minutes
    const deathScore = timePlayedSeconds / 300 / (deaths + 1)
    return killScore * deathScore
}
