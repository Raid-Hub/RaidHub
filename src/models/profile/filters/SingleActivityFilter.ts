import { v4 } from "uuid"
import { FilterCallback } from "~/types/generic"
import { ActivityFilter } from "~/types/profile"
import { SingleActivityFilters } from "~/util/profile/activityFilters"
import Activity from "../data/Activity"

export default class SingleActivityFilter implements ActivityFilter {
    key: keyof typeof SingleActivityFilters
    predicate: FilterCallback<Activity>
    id: string

    constructor(key: keyof typeof SingleActivityFilters) {
        this.key = key
        this.predicate = SingleActivityFilters[key]
        this.id = v4()
    }

    encode() {
        return this.key
    }

    deepClone(): ActivityFilter {
        return new SingleActivityFilter(this.key)
    }

    stringify(): string {
        return this.key
    }
}
