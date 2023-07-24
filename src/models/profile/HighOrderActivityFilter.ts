import { FilterCallback } from "../../types/generic"
import { ActivityFilter, ExtendedActivity } from "../../types/profile"
import { HighOrderActivityFilters } from "../../util/profile/activityFilters"

export default class HighOrderActivityFilter<T = any> implements ActivityFilter {
    key: string
    value: T
    highOrderFunc: (arg: T) => FilterCallback<ExtendedActivity>

    constructor(key: string, value: T) {
        this.key = key
        this.value = value
        this.highOrderFunc = HighOrderActivityFilters[key]
    }

    predicate(a: ExtendedActivity) {
        return this.highOrderFunc(this.value)(a)
    }

    encode(): string {
        return `{${this.key}:${JSON.stringify(this.value)}}`
    }
}
