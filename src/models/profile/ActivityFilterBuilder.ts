import { FilterCallback } from "../../types/generic"
import { ActivityFilter, ExtendedActivity } from "../../types/profile"

export type ActivityFilterCombinator = "|" | "&"

export default class ActivityFilterBuilder implements ActivityFilter {
    combinator: ActivityFilterCombinator
    children: ActivityFilter[]

    constructor(combinator: ActivityFilterCombinator, children: ActivityFilter[]) {
        this.combinator = combinator
        this.children = children
    }

    add(filter: ActivityFilter) {
        this.children.push(filter)
    }

    apply(arr: ExtendedActivity[]) {
        return arr.filter(this.predicate)
    }

    predicate(a: ExtendedActivity) {
        switch (this.combinator) {
            case "&":
                return this.children.reduce(
                    (base, filter) => (activity: ExtendedActivity) =>
                        base(activity) && filter.predicate(activity),
                    (_: ExtendedActivity) => true
                )(a)
            case "|":
                return this.children.reduce(
                    (base, filter) => (activity: ExtendedActivity) =>
                        base(activity) || filter.predicate(activity),
                    (_: ExtendedActivity) => false
                )(a)
        }
    }

    encode(): string {
        return `[${this.children.map(c => c.encode()).join(this.combinator)}]`
    }
}
