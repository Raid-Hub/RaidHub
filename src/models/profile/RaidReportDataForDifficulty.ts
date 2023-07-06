import {
    IRaidReportActivity,
    IRaidReportData,
    LowManActivity,
    SetOfLowmans
} from "../../types/profile"
import { RaidReportPlayerValues } from "../../types/raidreport"
import { Difficulty } from "../../util/destiny/raid"

export default class RaidReportDataForDifficulty implements IRaidReportData {
    difficulty: Difficulty
    fastestFullClear: { instanceId: string; value: number } | null
    flawlessTriumphActivity: IRaidReportActivity | null
    clears: number
    flawlessActivities: Map<string, IRaidReportActivity>
    lowmanActivities: Map<string, IRaidReportActivity>
    fullClears: number
    sherpaCount: number
    worldFirstPlacement: number | null
    constructor(data: RaidReportPlayerValues[], difficulty: Difficulty) {
        this.difficulty = difficulty
        this.fastestFullClear = null
        this.flawlessTriumphActivity = null
        this.clears = 0
        this.flawlessActivities = new Map()
        this.lowmanActivities = new Map()
        this.fullClears = 0
        this.sherpaCount = 0
        this.worldFirstPlacement = null

        data.forEach(
            ({
                fastestFullClear,
                flawlessDetails,
                clears,
                flawlessActivities,
                lowAccountCountActivities,
                fullClears,
                sherpaCount,
                worldFirstDetails
            }) => {
                if (fastestFullClear) {
                    if (
                        fastestFullClear.value <
                        (this.fastestFullClear?.value ?? Number.MAX_SAFE_INTEGER)
                    ) {
                        this.fastestFullClear = fastestFullClear
                    }
                }

                if (
                    flawlessDetails &&
                    parseInt(flawlessDetails.instanceId) <
                        (this.flawlessTriumphActivity
                            ? parseInt(this.flawlessTriumphActivity.instanceId)
                            : Number.MAX_SAFE_INTEGER)
                ) {
                    this.flawlessTriumphActivity = {
                        instanceId: flawlessDetails.instanceId,
                        playerCount: flawlessDetails.accountCount,
                        fresh: flawlessDetails.fresh,
                        difficulty: this.difficulty
                    }
                }

                this.clears += clears

                flawlessActivities?.forEach(fa => {
                    this.flawlessActivities.set(fa.instanceId, {
                        instanceId: fa.instanceId,
                        playerCount: fa.accountCount,
                        fresh: fa.fresh,
                        difficulty: this.difficulty
                    })
                })

                lowAccountCountActivities?.forEach(la => {
                    this.lowmanActivities.set(la.instanceId, {
                        instanceId: la.instanceId,
                        playerCount: la.accountCount,
                        fresh: la.fresh,
                        difficulty: this.difficulty
                    })
                })

                this.fullClears += fullClears

                this.sherpaCount += sherpaCount

                if (
                    worldFirstDetails &&
                    worldFirstDetails.rank < (this.worldFirstPlacement ?? Number.MAX_SAFE_INTEGER)
                ) {
                    this.worldFirstPlacement = worldFirstDetails.rank
                }
            }
        )
    }

    get firstFlawless(): IRaidReportActivity | undefined {
        return this.flawlessActivities.size
            ? Array.from(this.flawlessActivities.values()).reduce((prev, current) => {
                  if (current.fresh && prev.fresh === null) {
                      return current
                  } else if (current.fresh) {
                      return parseInt(current.instanceId) < parseInt(prev.instanceId)
                          ? current
                          : prev
                  } else {
                      return prev
                  }
              })
            : undefined
    }

    get lowmans(): SetOfLowmans {
        let lowest: LowManActivity | null = null
        let lowestFresh: LowManActivity | null = null
        let lowestFlawless: LowManActivity | null = null

        this.lowmanActivities.forEach((activity, id) => {
            const isFlawless = !!this.flawlessActivities.get(id)
            const activitWithFlawlessKey = { ...activity, flawless: isFlawless }

            if (!lowestFresh && activity.fresh) {
                lowestFresh = activitWithFlawlessKey
            } else if (activity.fresh && lowestFresh && moreRelevantLowMan(activity, lowestFresh)) {
                lowestFresh = activitWithFlawlessKey
            }

            if (!lowestFlawless && isFlawless) {
                lowestFlawless = activitWithFlawlessKey
            } else if (
                isFlawless &&
                lowestFlawless &&
                moreRelevantLowMan(activity, lowestFlawless)
            ) {
                lowestFlawless = activitWithFlawlessKey
            }

            if (!lowest) {
                lowest = activitWithFlawlessKey
            } else if (moreRelevantLowMan(activity, lowest)) {
                lowest = activitWithFlawlessKey
            }
        })

        return {
            lowest,
            lowestFresh,
            lowestFlawless:
                lowestFlawless ??
                (this.firstFlawless ? { ...this.firstFlawless!, flawless: true } : null)
        }
    }
}

function moreRelevantLowMan(a: IRaidReportActivity, b: IRaidReportActivity) {
    const score = (x: boolean | null) => (x === null ? 0 : x ? 2 : 1)
    return (
        a.playerCount < b.playerCount ||
        (a.playerCount === b.playerCount &&
            score(a.fresh) <= score(b.fresh) &&
            parseInt(a.instanceId) < parseInt(b.instanceId))
    )
}
