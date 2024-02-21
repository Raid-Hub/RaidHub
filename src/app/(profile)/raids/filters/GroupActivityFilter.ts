import { type ActivityFilter } from "~/app/(profile)/raids/filters/activityFilters"
import type { RaidHubPlayerActivitiesActivity } from "~/types/raidhub-api"

type ActivityFilterCombinator = "|" | "&"

export default class GroupActivityFilter implements ActivityFilter {
    combinator: ActivityFilterCombinator
    children: ActivityFilter[]

    constructor(combinator: ActivityFilterCombinator, children: ActivityFilter[]) {
        this.combinator = combinator
        this.children = children
    }

    predicate(a: RaidHubPlayerActivitiesActivity) {
        switch (this.combinator) {
            case "&":
                return !this.children.length
                    ? true
                    : this.children.reduce(
                          (base, filter) => activity =>
                              base(activity) && filter.predicate(activity),
                          (_: RaidHubPlayerActivitiesActivity) => true
                      )(a)
            case "|":
                return !this.children.length
                    ? true
                    : this.children.reduce(
                          (base, filter) => activity =>
                              base(activity) || filter.predicate(activity),
                          (_: RaidHubPlayerActivitiesActivity) => false
                      )(a)
        }
    }

    encode() {
        return {
            [this.combinator]: this.children.map(c => c.encode())
        }
    }
}
