import { Collection } from "@discordjs/collection"
import GroupActivityFilter, {
    ActivityFilterCombinator
} from "../../models/profile/filters/GroupActivityFilter"
import HighOrderActivityFilter from "../../models/profile/filters/HighOrderActivityFilter"
import NotActivityFilter from "../../models/profile/filters/NotActivityFilter"
import SingleActivityFilter from "../../models/profile/filters/SingleActivityFilter"
import { FilterCallback } from "../../types/generic"
import { ActivityFilter, ExtendedActivity } from "../../types/profile"
import { Difficulty } from "../../types/raids"

export enum FilterOption {
    SUCCESS = "Success",
    FLAWLESS = "Flawless",
    TRIO = "Trio",
    DUO = "Duo",
    SOLO = "Solo",
    DIFFICULTY = "Difficulty",
    MIN_MINS_PLAYED = "MinMins"
}

export const HighOrderActivityFilters = {
    [FilterOption.DIFFICULTY]:
        (difficulty: Difficulty) =>
        ({ activity }: ExtendedActivity) =>
            difficulty === activity.difficulty,
    [FilterOption.MIN_MINS_PLAYED]:
        (minutes: number) =>
        ({ activity }: ExtendedActivity) =>
            activity.durationSeconds >= minutes / 60
} satisfies Record<string, (arg: any) => FilterCallback<ExtendedActivity>>

export const SingleActivityFilters = {
    [FilterOption.SUCCESS]: ({ activity }: ExtendedActivity) => !!activity.completed,
    [FilterOption.FLAWLESS]: ({ extended }: ExtendedActivity) => !!extended.flawless,
    [FilterOption.TRIO]: ({ extended }: ExtendedActivity) => extended.playerCount === 3,
    [FilterOption.DUO]: ({ extended }: ExtendedActivity) => extended.playerCount === 2,
    [FilterOption.SOLO]: ({ extended }: ExtendedActivity) => extended.playerCount === 1
} satisfies Record<string, FilterCallback<ExtendedActivity>>

export enum FilterListName {
    Or,
    And,
    Not,
    Success,
    Incomplete,
    Flawless,
    AnyLowman,
    Solo,
    Duo,
    Trio,
    MinMinutes,
    Master,
    Prestige
}
export const FiltersToSelectFrom: Record<FilterListName, () => ActivityFilter> = {
    [FilterListName.Success]: () => new SingleActivityFilter(FilterOption.SUCCESS),
    [FilterListName.Incomplete]: () =>
        new NotActivityFilter(new SingleActivityFilter(FilterOption.SUCCESS)),
    [FilterListName.Flawless]: () => new SingleActivityFilter(FilterOption.FLAWLESS),
    [FilterListName.AnyLowman]: () =>
        new GroupActivityFilter("|", [
            new SingleActivityFilter(FilterOption.SOLO),
            new SingleActivityFilter(FilterOption.DUO),
            new SingleActivityFilter(FilterOption.TRIO)
        ]),
    [FilterListName.Solo]: () => new SingleActivityFilter(FilterOption.SOLO),
    [FilterListName.Duo]: () => new SingleActivityFilter(FilterOption.DUO),
    [FilterListName.Trio]: () => new SingleActivityFilter(FilterOption.TRIO),
    [FilterListName.MinMinutes]: () => new HighOrderActivityFilter(FilterOption.MIN_MINS_PLAYED, 5),
    [FilterListName.Master]: () =>
        new HighOrderActivityFilter(FilterOption.DIFFICULTY, Difficulty.MASTER),
    [FilterListName.Prestige]: () =>
        new HighOrderActivityFilter(FilterOption.DIFFICULTY, Difficulty.PRESTIGE),
    [FilterListName.Or]: () => new GroupActivityFilter("|", []),
    [FilterListName.And]: () => new GroupActivityFilter("&", []),
    [FilterListName.Not]: () => new NotActivityFilter(null)
}

// min 5 mins played or lowman
export const DefaultActivityFilters = new GroupActivityFilter("|", [
    new GroupActivityFilter("&", [
        FiltersToSelectFrom[FilterListName.AnyLowman](),
        FiltersToSelectFrom[FilterListName.Success]()
    ]),
    new GroupActivityFilter("&", [
        FiltersToSelectFrom[FilterListName.MinMinutes](),
        new NotActivityFilter(FiltersToSelectFrom[FilterListName.AnyLowman]())
    ])
])

const brackets = ["<", ">", "[", "]", "{", "}", "(", ")"]
const bracketInverse = {
    ">": "<",
    "]": "[",
    "}": "{",
    ")": "("
} as Record<string, string>

export function decodeFilters(json: any): ActivityFilter | null {
    if (!json) return null
    try {
        switch (typeof json) {
            case "object":
                if (json["|"] && Array.isArray(json["|"])) {
                    return new GroupActivityFilter("|", json["|"].map(decodeFilters))
                } else if (json["&"] && Array.isArray(json["&"])) {
                    return new GroupActivityFilter("&", json["&"].map(decodeFilters))
                } else if (json["not"]) {
                    return new NotActivityFilter(decodeFilters(json["not"]))
                } else if (Array.isArray(json)) {
                    const [key, value] = json
                    return new HighOrderActivityFilter(
                        key as unknown as keyof typeof HighOrderActivityFilters,
                        value
                    )
                }
            case "string":
                return new SingleActivityFilter(
                    json as unknown as keyof typeof SingleActivityFilters
                )
        }
        return null
    } catch (e) {
        console.error(e)
        return DefaultActivityFilters
    }
}
