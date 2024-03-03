import { type ActivityFilter } from "~/app/(profile)/raids/filters/activityFilters"
import type { RaidHubPlayerActivitiesActivity } from "~/services/raidhub/types"

export default class NotActivityFilter implements ActivityFilter {
    child: ActivityFilter | null

    constructor(child: ActivityFilter | null) {
        this.child = child
    }

    predicate(a: RaidHubPlayerActivitiesActivity) {
        return !(this.child?.predicate(a) ?? false)
    }

    encode() {
        return {
            not: this.child?.encode() ?? null
        }
    }
}
