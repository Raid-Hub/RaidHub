import { DestinyHistoricalStatsValue } from "bungie-net-core/models"
import { ListedRaid } from "~/types/raidhub-api"

type DestinyHistoricalStatsDictionary = { [key: string]: DestinyHistoricalStatsValue }

export default class RaidStats {
    raid: ListedRaid
    raw: DestinyHistoricalStatsDictionary[]
    assists: number
    totalClears: number
    deaths: number
    kills: number
    precisionKills: number
    secondsPlayed: number

    constructor(data: DestinyHistoricalStatsDictionary[], raid: ListedRaid) {
        this.raw = data
        this.raid = raid

        const values = data.reduce(
            (base, current) => {
                const valueFor = (key: keyof DestinyHistoricalStatsDictionary) =>
                    current[key].basic.value
                return {
                    assists: base.assists + valueFor("activityAssists"),
                    totalClears: base.totalClears + valueFor("activityCompletions"),
                    deaths: base.deaths + valueFor("activityDeaths"),
                    kills: base.kills + valueFor("activityKills"),
                    precisionKills: base.precisionKills + valueFor("activityPrecisionKills"),
                    secondsPlayed: base.secondsPlayed + valueFor("activitySecondsPlayed")
                }
            },
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
