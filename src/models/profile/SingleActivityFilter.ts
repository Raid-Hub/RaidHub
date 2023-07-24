import { FilterCallback } from "../../types/generic"
import { ActivityFilter, ExtendedActivity } from "../../types/profile"
import { FilterOption, SingleActivityFilters } from "../../util/profile/activityFilters"

export default class SingleActivityFilter implements ActivityFilter {
    key: string
    predicate: FilterCallback<ExtendedActivity>

    constructor(key: string) {
        this.key = key
        this.predicate = SingleActivityFilters[key]
    }

    encode(): string {
        return `(${this.key})`
    }
}
