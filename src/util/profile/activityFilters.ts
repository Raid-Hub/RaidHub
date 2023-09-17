import Activity from "~/models/profile/data/Activity"
import GroupActivityFilter from "~/models/profile/filters/GroupActivityFilter"
import HighOrderActivityFilter from "~/models/profile/filters/HighOrderActivityFilter"
import NotActivityFilter from "~/models/profile/filters/NotActivityFilter"
import SingleActivityFilter from "~/models/profile/filters/SingleActivityFilter"
import { FilterCallback } from "~/types/generic"
import { ActivityFilter } from "~/types/profile"
import { Difficulty } from "~/types/raids"

export enum FilterOption {
    SUCCESS = "Success",
    FLAWLESS = "Flawless",
    TRIO = "Trio",
    DUO = "Duo",
    SOLO = "Solo",
    CPB = "CP Bot",
    DIFFICULTY = "Difficulty",
    MIN_MINS_PLAYED = "MinMins"
}

export const HighOrderActivityFilters = {
    [FilterOption.DIFFICULTY]: (difficulty: Difficulty) => (activity: Activity) =>
        difficulty === activity.difficulty,
    [FilterOption.MIN_MINS_PLAYED]: (minutes: number) => (activity: Activity) =>
        activity.durationSeconds >= minutes * 60
} satisfies Record<string, (arg: any) => FilterCallback<Activity>>

export const SingleActivityFilters = {
    [FilterOption.SUCCESS]: (activity: Activity) => !!activity.completed,
    [FilterOption.FLAWLESS]: (activity: Activity) => !!activity.flawless,
    [FilterOption.CPB]: (activity: Activity) => activity.playerCount > 50,
    [FilterOption.TRIO]: (activity: Activity) => activity.playerCount === 3,
    [FilterOption.DUO]: (activity: Activity) => activity.playerCount === 2,
    [FilterOption.SOLO]: (activity: Activity) => activity.playerCount === 1
} satisfies Partial<Record<FilterOption, FilterCallback<Activity>>>

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
    Cpb,
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
    [FilterListName.Cpb]: () => new SingleActivityFilter(FilterOption.CPB),
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
        new NotActivityFilter(FiltersToSelectFrom[FilterListName.AnyLowman]()),
        new NotActivityFilter(FiltersToSelectFrom[FilterListName.Cpb]())
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
                        JSON.parse(value)
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
