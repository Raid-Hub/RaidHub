import { v4 } from "uuid"
import { FilterCallback } from "~/types/generic"
import { ActivityFilter } from "~/types/profile"
import { HighOrderActivityFilters } from "~/util/profile/activityFilters"
import Activity from "../data/Activity"

export default class HighOrderActivityFilter<T = any> implements ActivityFilter {
    key: keyof typeof HighOrderActivityFilters
    value: T
    highOrderFunc: (arg: T) => FilterCallback<Activity>
    id: string

    constructor(key: keyof typeof HighOrderActivityFilters, value: T) {
        this.key = key
        this.value = value
        // @ts-expect-error
        this.highOrderFunc = HighOrderActivityFilters[key]
        this.id = v4()
    }

    predicate(a: Activity) {
        return this.highOrderFunc(this.value)(a)
    }

    encode() {
        return [this.key, JSON.stringify(this.value)]
    }

    deepClone(): ActivityFilter {
        return new HighOrderActivityFilter(this.key, this.value)
    }

    stringify(): string {
        return `{${this.key}: ${JSON.stringify(this.value)}}`
    }
}
