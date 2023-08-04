import { v4 } from "uuid"
import { ActivityFilter, ExtendedActivity } from "../../../types/profile"
import { Collection } from "@discordjs/collection"

export type ActivityFilterCombinator = "|" | "&"

export default class GroupActivityFilter implements ActivityFilter {
    combinator: ActivityFilterCombinator
    children: Collection<string, ActivityFilter>
    id: string

    constructor(combinator: ActivityFilterCombinator, children: (ActivityFilter | null)[]) {
        this.combinator = combinator
        this.children = new Collection(
            (children.filter(Boolean) as ActivityFilter[]).map(c => [c.id, c])
        )
        this.id = v4()
    }

    predicate(a: ExtendedActivity) {
        switch (this.combinator) {
            case "&":
                return !this.children.size
                    ? true
                    : Array.from(this.children.values()).reduce(
                          (base, filter) => (activity: ExtendedActivity) =>
                              base(activity) && filter.predicate(activity),
                          (_: ExtendedActivity) => true
                      )(a)
            case "|":
                return !this.children.size
                    ? true
                    : Array.from(this.children.values()).reduce(
                          (base, filter) => (activity: ExtendedActivity) =>
                              base(activity) || filter.predicate(activity),
                          (_: ExtendedActivity) => false
                      )(a)
        }
    }

    encode() {
        return {
            [this.combinator]: Array.from(this.children.values()).map(c => c.encode())
        }
    }

    deepClone(): ActivityFilter {
        return new GroupActivityFilter(
            this.combinator,
            this.children.map(c => c.deepClone())
        )
    }

    stringify(): string {
        return `(${Array.from(this.children.values())
            .map(c => c.stringify())
            .join(` ${this.combinator === "&" ? "and" : "or"} `)})`
    }
}
