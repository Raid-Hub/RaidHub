import Activity from "../../models/profile/Activity"
import { FilterCallback } from "../../types/generic"
import { Difficulty } from "../../types/raids"

export type ExtendedActivity = {
    activity: Activity
    extended: {
        fresh: boolean | null
        playerCount: number
        flawless: boolean | null
    }
}

export enum FilterOptions {
    SUCCESS = "Success",
    FLAWLESS = "Flawless",
    LOWMAN = "Lowman",
    SOLO = "Solo",
    DIFFICULTY = "Difficulty",
    MIN_SECS_PLAYED = "Min Secs Played"
}

export const AvailableFilterOptions = {
    [FilterOptions.SUCCESS]: ({ activity }: ExtendedActivity) => !!activity.completed,
    [FilterOptions.FLAWLESS]: ({ extended }: ExtendedActivity) => !!extended.flawless,
    [FilterOptions.LOWMAN]: ({ activity }: ExtendedActivity) => activity.playerCount <= 3,
    [FilterOptions.SOLO]: ({ activity }: ExtendedActivity) => activity.playerCount === 1,
    [FilterOptions.DIFFICULTY]:
        (difficulties: Difficulty[]) =>
        ({ activity }: ExtendedActivity) =>
            difficulties.includes(activity.difficulty),
    [FilterOptions.MIN_SECS_PLAYED]:
        (seconds: number) =>
        ({ activity }: ExtendedActivity) =>
            activity.durationSeconds >= seconds
} satisfies {
    [key in FilterOptions]: Function
}

export const DefaultActivityFilters: FilterCallback<ExtendedActivity>[] = [
    activity =>
        [
            AvailableFilterOptions[FilterOptions.MIN_SECS_PLAYED](300),
            AvailableFilterOptions[FilterOptions.LOWMAN]
        ].reduce((base, filter) => base || filter(activity), false)
    // min 5 mins played or lowman
]
