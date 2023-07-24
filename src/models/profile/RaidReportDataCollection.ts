import { Collection } from "@discordjs/collection"
import {
    IRaidReportActivity,
    IRaidReportData,
    LowManActivity,
    RaidTag,
    SetOfLowmans
} from "../../types/profile"
import { RaidReportPlayerValues } from "../../types/raidreport"
import { Difficulty } from "../../types/raids"
import { isBestTag } from "../../util/raidhub/tags"
import RaidReportData from "./RaidReportData"
import AbstractRaidDataCollection from "./AbstractRaidDataCollection"

export default class RaidReportDataCollection
    extends AbstractRaidDataCollection<RaidReportData, RaidReportPlayerValues>
    implements IRaidReportData
{
    add(difficulty: Difficulty, values: RaidReportPlayerValues[]) {
        this.set(difficulty, new RaidReportData(values, this.raid, difficulty))
    }

    eveythingFor(activityId: string) {
        return {
            playerCount: 6,
            fresh: false,
            flawless: this.flawlessActivities.has(activityId),
            ...(this.flawlessActivities.get(activityId) ?? {}),
            ...(this.lowmanActivities.get(activityId) ?? {})
        }
    }

    get fastestFullClear(): { instanceId: string; value: number } | null {
        return this.reduce((prev, { fastestFullClear }) => {
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
        return this.reduce((prev, { flawlessTriumphActivity }) => {
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
        return this.reduce((prev, { clears }) => clears + prev, 0)
    }
    get flawlessActivities(): Collection<string, IRaidReportActivity> {
        return this.reduce(
            (collection, val) => collection.concat(val.flawlessActivities),
            new Collection<string, IRaidReportActivity>()
        )
    }
    get lowmanActivities(): Collection<string, IRaidReportActivity> {
        return this.reduce(
            (collection, val) => collection.concat(val.lowmanActivities),
            new Collection<string, IRaidReportActivity>()
        )
    }
    get fullClears(): number {
        return this.reduce((prev, { fullClears }) => fullClears + prev, 0)
    }
    get sherpaCount(): number {
        return this.reduce((prev, { sherpaCount }) => sherpaCount + prev, 0)
    }
    get worldFirstPlacement(): number | null {
        return this.reduce((prev, { worldFirstPlacement }) => {
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
