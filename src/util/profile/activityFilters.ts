import ActivityFilterBuilder, {
    ActivityFilterCombinator
} from "../../models/profile/ActivityFilterBuilder"
import HighOrderActivityFilter from "../../models/profile/HighOrderActivityFilter"
import NotActivityFilter from "../../models/profile/NotActivityFilter"
import SingleActivityFilter from "../../models/profile/SingleActivityFilter"
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

export const HighOrderActivityFilters: Record<
    string,
    (arg: any) => FilterCallback<ExtendedActivity>
> = {
    [FilterOption.DIFFICULTY]:
        (difficulties: Difficulty[]) =>
        ({ activity }: ExtendedActivity) =>
            difficulties.includes(activity.difficulty),
    [FilterOption.MIN_SECS_PLAYED]:
        (seconds: number) =>
        ({ activity }: ExtendedActivity) =>
            activity.durationSeconds >= seconds
}

export const SingleActivityFilters: Record<string, FilterCallback<ExtendedActivity>> = {
    [FilterOption.SUCCESS]: ({ activity }: ExtendedActivity) => !!activity.completed,
    [FilterOption.FLAWLESS]: ({ extended }: ExtendedActivity) => !!extended.flawless,
    [FilterOption.LOWMAN]: ({ extended }: ExtendedActivity) => extended.playerCount <= 3,
    [FilterOption.TRIO]: ({ extended }: ExtendedActivity) => extended.playerCount === 3,
    [FilterOption.DUO]: ({ extended }: ExtendedActivity) => extended.playerCount === 2,
    [FilterOption.SOLO]: ({ extended }: ExtendedActivity) => extended.playerCount === 1
}

export const DefaultActivityFilters: ActivityFilter = new ActivityFilterBuilder("|", [
    new ActivityFilterBuilder("&", [
        new SingleActivityFilter(FilterOption.LOWMAN),
        new SingleActivityFilter(FilterOption.SUCCESS)
    ]),
    new ActivityFilterBuilder("&", [
        new HighOrderActivityFilter(FilterOption.MIN_SECS_PLAYED, 300),
        new NotActivityFilter(new SingleActivityFilter(FilterOption.LOWMAN))
    ])
])
// min 5 mins played or lowman

const brackets = ["<", ">", "[", "]", "{", "}", "(", ")"]
const bracketInverse = {
    ">": "<",
    "]": "[",
    "}": "{",
    ")": "("
} as Record<string, string>

export function decodeFilters(from: string): ActivityFilter {
    if (from.startsWith("!")) {
        return new NotActivityFilter(decodeFilters(from.substring(1, from.length - 1)))
    } else if (from.startsWith("(")) {
        return new SingleActivityFilter(from.substring(1, from.length - 1))
    } else if (from.startsWith("{")) {
        const splitter = from.indexOf(":")
        return new HighOrderActivityFilter(
            from.substring(1, splitter),
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
        if (!combinator) throw new Error("Error decoding ActivityFilterBuilder: no combinator")
        return new ActivityFilterBuilder(
            combinator,
            elements.map(e => decodeFilters(e))
        )
    }
    throw new Error("Error decoding filter: no braces")
}
