import { type ActivityFilter } from "~/app/(profile)/raids/filters/activityFilters"
import type { RaidHubInstanceForPlayer } from "~/services/raidhub/types"

export default class NotActivityFilter implements ActivityFilter {
    child: ActivityFilter | null

    constructor(child: ActivityFilter | null) {
        this.child = child
    }

    predicate(a: RaidHubInstanceForPlayer) {
        return !(this.child?.predicate(a) ?? false)
    }

    encode() {
        return {
            not: this.child?.encode() ?? null
        }
    }
}
