import { v4 } from "uuid"
import { FilterCallback } from "../../types/generic"
import { ActivityFilter, ExtendedActivity } from "../../types/profile"
import { SingleActivityFilters } from "../../util/profile/activityFilters"

export default class SingleActivityFilter implements ActivityFilter {
    key: keyof typeof SingleActivityFilters
    predicate: FilterCallback<ExtendedActivity>
    id: string

    constructor(key: keyof typeof SingleActivityFilters) {
        this.key = key
        this.predicate = SingleActivityFilters[key]
        this.id = v4()
    }

    encode(): string {
        return `(${this.key})`
    }

    deepClone(): ActivityFilter {
        return new SingleActivityFilter(this.key)
    }
}
