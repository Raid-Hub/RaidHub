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
    LOWMAN = "Lowman",
    TRIO = "Trio",
    DUO = "Duo",
    SOLO = "Solo",
    DIFFICULTY = "Difficulty",
    MIN_SECS_PLAYED = "Min Secs Played"
}

export const HighOrderActivityFilters = {
    [FilterOption.DIFFICULTY]:
        (difficulty: Difficulty) =>
        ({ activity }: ExtendedActivity) =>
            difficulty === activity.difficulty,
    [FilterOption.MIN_SECS_PLAYED]:
        (seconds: number) =>
        ({ activity }: ExtendedActivity) =>
            activity.durationSeconds >= seconds,
    [FilterOption.LOWMAN]:
        (playerCount: number) =>
        ({ extended }: ExtendedActivity) =>
            extended.playerCount === playerCount
} satisfies Record<string, (arg: any) => FilterCallback<ExtendedActivity>>

export const SingleActivityFilters = {
    [FilterOption.SUCCESS]: ({ activity }: ExtendedActivity) => !!activity.completed,
    [FilterOption.FLAWLESS]: ({ extended }: ExtendedActivity) => !!extended.flawless
} satisfies Record<string, FilterCallback<ExtendedActivity>>

export const FiltersToSelectFrom = new Collection<string, () => ActivityFilter>([
    ["success", () => new SingleActivityFilter(FilterOption.SUCCESS)],
    ["flawless", () => new SingleActivityFilter(FilterOption.FLAWLESS)],
    [
        "any lowman",
        () =>
            new GroupActivityFilter("|", [
                new HighOrderActivityFilter(FilterOption.LOWMAN, 3),
                new HighOrderActivityFilter(FilterOption.LOWMAN, 2),
                new HighOrderActivityFilter(FilterOption.LOWMAN, 1)
            ])
    ],
    ["solo", () => new HighOrderActivityFilter(FilterOption.LOWMAN, 1)],
    ["duo", () => new HighOrderActivityFilter(FilterOption.LOWMAN, 2)],
    ["trio", () => new HighOrderActivityFilter(FilterOption.LOWMAN, 3)],
    ["min time", () => new HighOrderActivityFilter(FilterOption.MIN_SECS_PLAYED, 300)],
    ["master", () => new HighOrderActivityFilter(FilterOption.DIFFICULTY, Difficulty.MASTER)],
    ["prestige", () => new HighOrderActivityFilter(FilterOption.DIFFICULTY, Difficulty.PRESTIGE)],
    ["or", () => new GroupActivityFilter("|", [])],
    ["and", () => new GroupActivityFilter("&", [])],
    ["not", () => new NotActivityFilter(null)]
])

// min 5 mins played or lowman
export const DefaultActivityFilters: ActivityFilter = new GroupActivityFilter("|", [
    new GroupActivityFilter("&", [
        FiltersToSelectFrom.get("any lowman")!(),
        new SingleActivityFilter(FilterOption.SUCCESS)
    ]),
    new GroupActivityFilter("&", [
        new HighOrderActivityFilter(FilterOption.MIN_SECS_PLAYED, 300),
        new NotActivityFilter(FiltersToSelectFrom.get("any lowman")!())
    ])
])

const brackets = ["<", ">", "[", "]", "{", "}", "(", ")"]
const bracketInverse = {
    ">": "<",
    "]": "[",
    "}": "{",
    ")": "("
} as Record<string, string>

export function decodeFilters(from: string): ActivityFilter {
    if (from.startsWith("<")) {
        return new NotActivityFilter(decodeFilters(from.substring(1, from.length - 1)))
    } else if (from.startsWith("(")) {
        return new SingleActivityFilter(
            from.substring(1, from.length - 1) as keyof typeof SingleActivityFilters
        )
    } else if (from.startsWith("{")) {
        const splitter = from.indexOf(":")
        return new HighOrderActivityFilter(
            from.substring(1, splitter) as keyof typeof HighOrderActivityFilters,
            JSON.parse(from.substring(splitter + 1, from.length - 1))
        )
    } else if (from.startsWith("[")) {
        let i = 1
        let combinator: ActivityFilterCombinator | undefined = undefined
        const elements = []
        while (i < from.length - 1) {
            const start = i
            let stack = new Array<string>(from[i])
            i++
            while (stack.length && i < from.length - 1) {
                if (
                    bracketInverse[from[i]] !== undefined &&
                    bracketInverse[from[i]] === stack[stack.length - 1]
                ) {
                    stack.pop()
                } else if (brackets.includes(from[i])) {
                    stack.push(from[i])
                }
                i++
            }
            elements.push(from.substring(start, i))
            if (i < from.length - 1) {
                combinator = from[i] as ActivityFilterCombinator
            }
            i++
        }
        return new GroupActivityFilter(
            combinator ?? "&",
            elements.map(e => decodeFilters(e))
        )
    }
    throw new Error("Error decoding filter: no braces " + from)
}
