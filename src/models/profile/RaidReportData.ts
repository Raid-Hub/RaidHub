import {
    IRaidReportActivity,
    IRaidReportData,
    LowManActivity,
    RaidTag,
    SetOfLowmans
} from "../../types/profile"
import { RaidReportPlayerValues } from "../../types/raidreport"
import { Difficulty, Raid } from "../../types/raids"
import { isBestTag } from "../../util/raidhub/tags"
import RaidReportDataForDifficulty from "./RaidReportDataForDifficulty"

export default class RaidReportData
    extends Map<Difficulty, RaidReportDataForDifficulty>
    implements IRaidReportData
{
    raid: Raid
    constructor(raid: Raid) {
        super()
        this.raid = raid
    }
    add(difficulty: Difficulty, values: RaidReportPlayerValues[]) {
        this.set(difficulty, new RaidReportDataForDifficulty(values, difficulty))
    }

    get fastestFullClear(): { instanceId: string; value: number } | null {
        return Array.from(this.values()).reduce((prev, { fastestFullClear }) => {
            if (fastestFullClear && prev) {
                if (fastestFullClear.value < prev.value) {
                    return fastestFullClear
                }
            } else if (fastestFullClear) {
                return fastestFullClear
            }
            return prev
        }, null as { instanceId: string; value: number } | null)
    }

    get flawlessTriumphActivity(): IRaidReportActivity | null {
        return Array.from(this.values()).reduce((prev, { flawlessTriumphActivity }) => {
            if (flawlessTriumphActivity && prev) {
                if (parseInt(flawlessTriumphActivity.instanceId) < parseInt(prev.instanceId)) {
                    return flawlessTriumphActivity
                }
            } else if (flawlessTriumphActivity) {
                return flawlessTriumphActivity
            }
            return prev
        }, null as IRaidReportActivity | null)
    }
    get clears(): number {
        return Array.from(this.values()).reduce((prev, { clears }) => clears + prev, 0)
    }
    get flawlessActivities(): Map<string, IRaidReportActivity> {
        const map = new Map<string, IRaidReportActivity>()
        this.forEach(val => {
            val.flawlessActivities.forEach(a => {
                map.set(a.instanceId, a)
            })
        })
        return map
    }
    get lowmanActivities(): Map<string, IRaidReportActivity> {
        const map = new Map<string, IRaidReportActivity>()
        this.forEach(val => {
            val.lowmanActivities.forEach(a => {
                map.set(a.instanceId, a)
            })
        })
        return map
    }
    get fullClears(): number {
        return Array.from(this.values()).reduce((prev, { fullClears }) => fullClears + prev, 0)
    }
    get sherpaCount(): number {
        return Array.from(this.values()).reduce((prev, { sherpaCount }) => sherpaCount + prev, 0)
    }
    get worldFirstPlacement(): number | null {
        return Array.from(this.values()).reduce((prev, { worldFirstPlacement }) => {
            if (worldFirstPlacement && prev) {
                return Math.min(worldFirstPlacement, prev)
            } else {
                return worldFirstPlacement ?? prev
            }
        }, null as null | number)
    }

    tags(): RaidTag[] {
        const contest = this.get(Difficulty.CONTEST)?.lowmans
        const master = this.get(Difficulty.MASTER)?.lowmans
        const normal = this.get(Difficulty.NORMAL)?.lowmans

        const compare = (
            currentLowest: LowManActivity | null,
            comparison: SetOfLowmans | undefined,
            key: keyof SetOfLowmans
        ) => {
            if (
                currentLowest &&
                comparison?.[key] &&
                comparison[key]!.playerCount <= currentLowest?.playerCount
            ) {
                return comparison.lowest
            } else {
                return currentLowest ?? comparison?.[key]
            }
        }

        // find the lowest-low man, prioritizing higher difficulties
        const [lowest, lowestFresh, lowestFlawless] = (
            ["lowest", "lowestFresh", "lowestFlawless"] as const
        ).map(key => {
            let lowest = compare(normal?.[key] ?? null, master, key)
            lowest = compare(lowest ?? null, contest, key)
            return lowest
        })

        const [lowestMaster, lowestFreshMaster, lowestFlawlessMaster] = (
            ["lowest", "lowestFresh", "lowestFlawless"] as const
        ).map(key => compare(master?.[key] ?? null, contest, key))

        // put them into buckets by size
        const buckets = new Map<number, LowManActivity[]>()
        const all = [
            lowest,
            lowestFresh,
            lowestFlawless,
            lowestMaster,
            lowestFreshMaster,
            lowestFlawlessMaster
        ]
        all.forEach(a => {
            if (a) {
                if (buckets.has(a.playerCount)) {
                    buckets.get(a.playerCount)!.push(a)
                } else {
                    buckets.set(a.playerCount, [a])
                }
            }
        })

        const tags: RaidTag[] = []
        const getScore = (a: LowManActivity) =>
            (a.flawless ? 3 : 0) + (a.fresh ? 2 : a.fresh === null ? 1 : 0)
        buckets.forEach(bucket => {
            const tag = bucket.reduce((base, current) =>
                getScore(current) > getScore(base) ? current : base
            )

            tags.push({ ...tag, raid: this.raid, bestPossible: isBestTag(tag, this.raid) })
        })

        return tags.sort((t1, t2) => t1.playerCount - t2.playerCount)
    }
}
