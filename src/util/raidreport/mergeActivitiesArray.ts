import RaidReportData from "../../models/profile/RaidReportData"
import RaidReportDataForDifficulty from "../../models/profile/RaidReportDataForDifficulty"
import { RaidReportHashSet, RaidReportPlayerValues } from "../../types/raidreport"
import { Raid, RaidDifficultyTuple, raidTupleFromHash } from "../destiny/raid"

export function mergeActivities(activities: RaidReportHashSet[]): Map<Raid, RaidReportData> {
    const buckets = new Map<string, RaidReportPlayerValues[]>()
    activities.forEach(({ activityHash, values }) => {
        try {
            const key = raidTupleFromHash(activityHash).join("+")
            if (buckets.has(key)) {
                buckets.get(key)!.push(values)
            } else {
                buckets.set(key, [values])
            }
        } catch (e) {
            console.error("Unidentified raid " + activityHash)
        }
    })

    const result = new Map<Raid, RaidReportData>()
    buckets.forEach((values, key) => {
        const [raid, difficulty] = key.split("+").map(char => parseInt(char)) as RaidDifficultyTuple
        if (result.has(raid)) {
            result.get(raid)!.add(difficulty, values)
        } else {
            const difficultyMap = new RaidReportData(raid)
            result.set(raid, difficultyMap)
            difficultyMap.set(difficulty, new RaidReportDataForDifficulty(values, difficulty))
        }
    })

    return result
}
