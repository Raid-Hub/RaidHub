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
        const value = (
            key: keyof DestinyHistoricalStatsDictionary,
            dict: DestinyHistoricalStatsDictionary
        ) => dict[key].basic.value

        const values = data.reduce(
            (base, current) => ({
                assists: base.assists + value("activityAssists", current),
                totalClears: base.totalClears + value("activityCompletions", current),
                deaths: base.deaths + value("activityDeaths", current),
                kills: base.kills + value("activityKills", current),
                precisionKills: base.precisionKills + value("activityPrecisionKills", current),
                secondsPlayed: base.secondsPlayed + value("activitySecondsPlayed", current)
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
}
