import { v4 } from "uuid"
import { ActivityFilter, ExtendedActivity } from "../../../types/profile"

export default class NotActivityFilter implements ActivityFilter {
    child: ActivityFilter | null
    id: string

    constructor(child: ActivityFilter | null) {
        this.child = child
        this.id = v4()
    }

    predicate(a: ExtendedActivity) {
        return !(this.child?.predicate(a) ?? false)
    }

    encode(): string {
        return `<${this.child?.encode() ?? ""}>`
    }

    deepClone(): ActivityFilter {
        return new NotActivityFilter(this.child?.deepClone() ?? null)
    }
}
