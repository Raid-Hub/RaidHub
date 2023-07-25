import { v4 } from "uuid"
import { FilterCallback } from "../../types/generic"
import { ActivityFilter, ExtendedActivity } from "../../types/profile"
import { HighOrderActivityFilters } from "../../util/profile/activityFilters"

export default class HighOrderActivityFilter<T = any> implements ActivityFilter {
    key: keyof typeof HighOrderActivityFilters
    value: T
    highOrderFunc: (arg: T) => FilterCallback<ExtendedActivity>
    id: string

    constructor(key: keyof typeof HighOrderActivityFilters, value: T) {
        this.key = key
        this.value = value
        // @ts-expect-error
        this.highOrderFunc = HighOrderActivityFilters[key]
        this.id = v4()
    }

    predicate(a: ExtendedActivity) {
        return this.highOrderFunc(this.value)(a)
    }

    encode(): string {
        return `{${this.key}:${JSON.stringify(this.value)}}`
    }

    deepClone(): ActivityFilter {
        return new HighOrderActivityFilter(this.key, this.value)
    }
}
