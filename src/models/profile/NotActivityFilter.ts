import { ActivityFilter, ExtendedActivity } from "../../types/profile"

export default class NotActivityFilter implements ActivityFilter {
    child: ActivityFilter

    constructor(child: ActivityFilter) {
        this.child = child
    }

    predicate(a: ExtendedActivity) {
        return !this.child.predicate(a)
    }

    encode(): string {
        return `<${this.child.encode()}>`
    }
}
