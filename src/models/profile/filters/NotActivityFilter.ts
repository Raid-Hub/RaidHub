import { v4 } from "uuid"
import { ActivityFilter } from "~/types/profile"
import Activity from "../data/Activity"

export default class NotActivityFilter implements ActivityFilter {
    child: ActivityFilter | null
    id: string

    constructor(child: ActivityFilter | null) {
        this.child = child
        this.id = v4()
    }

    predicate(a: Activity) {
        return !(this.child?.predicate(a) ?? false)
    }

    encode() {
        return {
            not: this.child?.encode() ?? null
        }
    }

    deepClone(): ActivityFilter {
        return new NotActivityFilter(this.child?.deepClone() ?? null)
    }

    stringify(): string {
        return `(not ${this.child?.stringify() ?? ""})`
    }
}
