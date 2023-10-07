import { ZodType, z } from "zod"
import Activity from "~/models/profile/data/Activity"
import GroupActivityFilter from "~/models/profile/filters/GroupActivityFilter"
import HighOrderActivityFilter from "~/models/profile/filters/HighOrderActivityFilter"
import NotActivityFilter from "~/models/profile/filters/NotActivityFilter"
import SingleActivityFilter from "~/models/profile/filters/SingleActivityFilter"
import { FilterCallback } from "~/types/generic"
import { ActivityFilter } from "~/types/profile"
import { CommonRaidDifficulties, Difficulty } from "~/types/raids"
import { includedIn } from "../betterIncludes"

export enum FilterOption {
    SUCCESS = "Success",
    FLAWLESS = "Flawless",
    TRIO = "Trio",
    DUO = "Duo",
    SOLO = "Solo",
    CPB = "CP Bot",
    DIFFICULTY = "Difficulty",
    MIN_MINS_PLAYED = "Min Mins",
    PLAYED_WITH = "Played With"
}

export const HighOrderActivityFilters = {
    [FilterOption.DIFFICULTY]: (difficulty: Difficulty) => (activity: Activity) =>
        difficulty === activity.difficulty,
    [FilterOption.MIN_MINS_PLAYED]: (minutes: number) => (activity: Activity) =>
        activity.durationSeconds >= minutes * 60,
    [FilterOption.PLAYED_WITH]: (playerIds: string[]) => (activity: Activity) =>
        playerIds.every(id => activity.playerIds.includes(id))
} satisfies Record<string, (arg: any) => FilterCallback<Activity>>

export const HighOrderActivityFilterSchema = {
    [FilterOption.DIFFICULTY]: z.number().refine(n => includedIn(CommonRaidDifficulties, n)),
    [FilterOption.MIN_MINS_PLAYED]: z.number().min(0),
    [FilterOption.PLAYED_WITH]: z.string().transform(s => s.split(",").map(ss => ss.trim()))
} satisfies Record<keyof typeof HighOrderActivityFilters, ZodType>

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
    Prestige,
    PlayedWith
}
export const FiltersToSelectFrom: Record<FilterListName, () => ActivityFilter> = {
    [FilterListName.Success]: () => new SingleActivityFilter(FilterOption.SUCCESS),
    [FilterListName.Incomplete]: () =>
        new NotActivityFilter(new SingleActivityFilter(FilterOption.SUCCESS)),
    [FilterListName.Flawless]: () => new SingleActivityFilter(FilterOption.FLAWLESS),
    [FilterListName.AnyLowman]: () =>
        new GroupActivityFilter("&", [
            new SingleActivityFilter(FilterOption.SUCCESS),
            new GroupActivityFilter("|", [
                new SingleActivityFilter(FilterOption.SOLO),
                new SingleActivityFilter(FilterOption.DUO),
                new SingleActivityFilter(FilterOption.TRIO)
            ])
        ]),
    [FilterListName.Solo]: () => new SingleActivityFilter(FilterOption.SOLO),
    [FilterListName.Duo]: () => new SingleActivityFilter(FilterOption.DUO),
    [FilterListName.Trio]: () => new SingleActivityFilter(FilterOption.TRIO),
    [FilterListName.MinMinutes]: () =>
        new HighOrderActivityFilter(FilterOption.MIN_MINS_PLAYED, 15),
    [FilterListName.Master]: () =>
        new HighOrderActivityFilter(FilterOption.DIFFICULTY, Difficulty.MASTER),
    [FilterListName.Prestige]: () =>
        new HighOrderActivityFilter(FilterOption.DIFFICULTY, Difficulty.PRESTIGE),
    [FilterListName.Cpb]: () => new SingleActivityFilter(FilterOption.CPB),
    [FilterListName.PlayedWith]: () => new HighOrderActivityFilter(FilterOption.PLAYED_WITH, []),
    [FilterListName.Or]: () => new GroupActivityFilter("|", []),
    [FilterListName.And]: () => new GroupActivityFilter("&", []),
    [FilterListName.Not]: () => new NotActivityFilter(null)
}

// min 15 mins played or lowman
export const DefaultActivityFilters = new GroupActivityFilter("|", [
    FiltersToSelectFrom[FilterListName.AnyLowman](),
    new GroupActivityFilter("&", [
        FiltersToSelectFrom[FilterListName.MinMinutes](),
        new NotActivityFilter(FiltersToSelectFrom[FilterListName.AnyLowman]()),
        new NotActivityFilter(FiltersToSelectFrom[FilterListName.Cpb]())
    ])
])

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
