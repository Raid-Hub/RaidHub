import { IRaidStats } from "../../types/profile"
import { DestinyHistoricalStatsDictionary } from "../../util/destiny/raidStatsMap"

export default class RaidStatsForDifficulty implements IRaidStats {
    assists: number
    totalClears: number
    deaths: number
    kills: number
    precisionKills: number
    secondsPlayed: number

    constructor(data: DestinyHistoricalStatsDictionary[]) {
        const values = data.reduce(
            (base, current) => ({
                assists: base.assists + current["activityAssists"].basic.value,
                totalClears: base.assists + current["activityCompletions"].basic.value,
                deaths: base.assists + current["activityDeaths"].basic.value,
                kills: base.assists + current["activityKills"].basic.value,
                precisionKills: base.assists + current["activityPrecisionKills"].basic.value,
                secondsPlayed: base.assists + current["activitySecondsPlayed"].basic.value
            }),
            {
                assists: 0,
                totalClears: 0,
                deaths: 0,
                kills: 0,
                precisionKills: 0,
                secondsPlayed: 0
            }
        )
        this.assists = values.assists
        this.totalClears = values.totalClears
        this.deaths = values.deaths
        this.kills = values.kills
        this.precisionKills = values.precisionKills
        this.secondsPlayed = values.secondsPlayed
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
