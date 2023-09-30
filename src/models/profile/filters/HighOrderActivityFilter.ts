import { v4 } from "uuid"
import { FilterCallback } from "~/types/generic"
import { ActivityFilter } from "~/types/profile"
import {
    HighOrderActivityFilterSchema,
    HighOrderActivityFilters
} from "~/util/profile/activityFilters"
import Activity from "../data/Activity"
import { HTMLAttributes, HTMLInputTypeAttribute } from "react"

export default class HighOrderActivityFilter<T = any> implements ActivityFilter {
    key: keyof typeof HighOrderActivityFilters
    value: T
    highOrderFunc: (arg: T) => FilterCallback<Activity>
    id: string
    inputType: HTMLInputTypeAttribute
    inputMode: HTMLAttributes<any>["inputMode"] & {}

    constructor(key: keyof typeof HighOrderActivityFilters, value: T) {
        this.key = key
        this.value = value
        // @ts-expect-error
        this.highOrderFunc = HighOrderActivityFilters[key]
        this.inputType = typeof this.value === "number" ? "number" : "text"
        this.inputMode = typeof this.value === "number" ? "numeric" : "text"
        this.id = v4()
    }

    get schema() {
        return HighOrderActivityFilterSchema[this.key]
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
