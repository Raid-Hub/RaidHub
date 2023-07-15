import { Collection } from "@discordjs/collection"
import { Difficulty, Raid, RaidDifficultyTuple, ValidRaidHash } from "../../types/raids"
import { encoders } from "../../util/encode"
import { AllValidHashes, raidTupleFromHash } from "../../util/destiny/raid"
import { RaidData } from "../../types/profile"

/**
 * Represents a collection of raid data keyed by difficulty. T represents the
 * Data type while R represents the Raw data used to create the collection
 */
export default abstract class AbstractRaidDataCollection<
    T extends RaidData<R>,
    R
> extends Collection<Difficulty, T> {
    raid: Raid
    constructor(raid: Raid) {
        super()
        this.raid = raid
    }

    abstract add(difficulty: Difficulty, values: R[]): void

    static groupActivities<T extends RaidData<R>, R, C extends AbstractRaidDataCollection<T, R>>(
        this: new (raid: Raid) => C,
        activities: {
            activityHash: ValidRaidHash | number
            values: R
        }[]
    ): Collection<Raid, C> {
        const buckets = new Map<string, R[]>()
        const [encode, decode] = encoders<RaidDifficultyTuple>()
        activities.forEach(({ activityHash, values }) => {
            const hash = activityHash.toString()
            if (AllValidHashes.includes(hash as ValidRaidHash)) {
                try {
                    // getting this key can throw an error if the activityHash is invalid
                    const key = encode(raidTupleFromHash(hash))
                    if (buckets.has(key)) {
                        buckets.get(key)!.push(values)
                    } else {
                        buckets.set(key, [values])
                    }
                } catch (e) {
                    console.error(e)
                }
            }
        })

        const result = new Collection<Raid, C>()
        buckets.forEach((values, key) => {
            const [raid, difficulty] = decode(key)
            if (result.has(raid)) {
                result.get(raid)!.add(difficulty, values)
            } else {
                const collection = new this(raid)
                result.set(raid, collection)
                collection.add(difficulty, values)
            }
        })

        return result
    }
}
