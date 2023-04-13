import { DestinyHistoricalStatsPeriodGroup } from "oodestiny/schemas"
import { FilterCallbackType } from "./types"

export enum Prefs {
    FILTER,
    PROFILE_BACKGROUND
}

export type PrefType<T extends Prefs> = T extends Prefs.FILTER
    ? FilterCallbackType<DestinyHistoricalStatsPeriodGroup>
    : T extends Prefs.PROFILE_BACKGROUND
    ? string
    : never

export enum FilterOptions {
    SUCCESS_ONLY,
    LOWMAN_ONLY,
    FINISH_OR_FULL_TEAM_5_MIN
}

export const AvailableFilterOptions: {
    [key in FilterOptions]: PrefType<Prefs.FILTER>
} = {
    [FilterOptions.SUCCESS_ONLY]: (
        value: DestinyHistoricalStatsPeriodGroup,
        index: number,
        array: DestinyHistoricalStatsPeriodGroup[]
    ): boolean => !!value.values.completed.basic.value,
    [FilterOptions.LOWMAN_ONLY]: (
        value: DestinyHistoricalStatsPeriodGroup,
        index: number,
        array: DestinyHistoricalStatsPeriodGroup[]
    ): boolean => !!value.values.completed.basic.value && value.values.playerCount.basic.value <= 3,
    [FilterOptions.FINISH_OR_FULL_TEAM_5_MIN]: (
        value: DestinyHistoricalStatsPeriodGroup,
        index: number,
        array: DestinyHistoricalStatsPeriodGroup[]
    ): boolean =>
        !!value.values.completed.basic.value ||
        (value.values.playerCount.basic.value >= 6 &&
            value.values.activityDurationSeconds.basic.value >= 300)
}

export const DefaultPreferences: { [K in Prefs]: PrefType<K> } = {
    [Prefs.FILTER]: AvailableFilterOptions[FilterOptions.FINISH_OR_FULL_TEAM_5_MIN],
    [Prefs.PROFILE_BACKGROUND]: ""
}

// temporary
export const NewoPrefs: { [K in Prefs]: PrefType<K> } = {
    [Prefs.FILTER]: AvailableFilterOptions[FilterOptions.FINISH_OR_FULL_TEAM_5_MIN],
    [Prefs.PROFILE_BACKGROUND]: "linear-gradient(25deg, #220333, #c688e6, #220333 70%);"
}
