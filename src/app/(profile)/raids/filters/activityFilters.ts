import type { RaidHubInstanceForPlayer } from "~/services/raidhub/types"
import { includedIn } from "~/util/helpers"
import { o } from "~/util/o"
import GroupActivityFilter from "./GroupActivityFilter"
import NotActivityFilter from "./NotActivityFilter"
import SingleActivityFilter from "./SingleActivityFilter"

export type FilterPredicate = (this: ActivityFilter, activity: RaidHubInstanceForPlayer) => boolean

export interface ActivityFilter {
    predicate: FilterPredicate
    encode(): object | string
}

export const SingleActivityFilterFunctions = {
    Success: (activity: RaidHubInstanceForPlayer) => activity.player.completed,
    Flawless: (activity: RaidHubInstanceForPlayer) => !!activity.flawless,
    CheckpointBot: (activity: RaidHubInstanceForPlayer) => activity.playerCount > 50,
    Lowman: (activity: RaidHubInstanceForPlayer) => activity.playerCount <= 3,
    Trio: (activity: RaidHubInstanceForPlayer) => activity.playerCount === 3,
    Duo: (activity: RaidHubInstanceForPlayer) => activity.playerCount === 2,
    Solo: (activity: RaidHubInstanceForPlayer) => activity.playerCount === 1,
    Min5MinsPlayed: (activity: RaidHubInstanceForPlayer) => activity.duration >= 5 * 60,
    Min15MinsPlayed: (activity: RaidHubInstanceForPlayer) => activity.duration >= 15 * 60
} satisfies Record<string, FilterPredicate>

export const getDefaultActivityFilters = () =>
    new GroupActivityFilter("|", [
        new SingleActivityFilter("Success"),
        new GroupActivityFilter("&", [
            new SingleActivityFilter("Min15MinsPlayed"),
            new NotActivityFilter(new SingleActivityFilter("CheckpointBot"))
        ])
    ])

export function decodeFilters(json: unknown): ActivityFilter | null {
    if (!json) return null
    try {
        switch (typeof json) {
            case "object":
                if ("|" in json && Array.isArray(json["|"])) {
                    return new GroupActivityFilter(
                        "|",
                        json["|"].map(decodeFilters).filter((f): f is ActivityFilter => !!f)
                    )
                } else if ("&" in json && Array.isArray(json["&"])) {
                    return new GroupActivityFilter(
                        "&",
                        json["&"].map(decodeFilters).filter((f): f is ActivityFilter => !!f)
                    )
                } else if ("not" in json) {
                    return new NotActivityFilter(decodeFilters(json.not))
                }
                break
            case "string":
                if (includedIn(o.keys(SingleActivityFilterFunctions), json)) {
                    return new SingleActivityFilter(json)
                }
                break
        }
        return null
    } catch (e) {
        console.error("Failed to decode activity filters", e)
        return null
    }
}
