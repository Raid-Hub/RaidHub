import { HistoricalStatsDict, IRaidStats } from "../../types/types"

export default class RaidStatsForDifficulty implements IRaidStats {
    assists: number
    totalClears: number
    deaths: number
    kills: number
    precisionKills: number
    secondsPlayed: number

    constructor({
        activityCompletions,
        activityAssists,
        activityDeaths,
        activityKills,
        activityPrecisionKills,
        activitySecondsPlayed
    }: HistoricalStatsDict<number>) {
        this.totalClears = activityCompletions
        this.assists = activityAssists
        this.deaths = activityDeaths
        this.kills = activityKills
        this.precisionKills = activityPrecisionKills
        this.secondsPlayed = activitySecondsPlayed
    }

    get fastestClear(): number {
        return 0
    }

    get averageClear(): number {
        return 0
    }

    get sherpas(): number {
        return 0
    }
}
