import { DestinyHistoricalStatsPeriodGroup } from "oodestiny/schemas";
import { FilterCallbackType } from "./types";

export enum Prefs {
    FILTER,
}

export type PrefType<T extends Prefs> =
    T extends Prefs.FILTER ? FilterCallbackType<DestinyHistoricalStatsPeriodGroup>
    : never;

export enum FilterOptions {
    SUCCESS_ONLY,
    LOWMAN_ONLY,
    FINISH_OR_FULL_TEAM_5_MIN
}

export const AvailableFilterOptions: { [key in FilterOptions]: PrefType<Prefs.FILTER> } = {
    [FilterOptions.SUCCESS_ONLY]: (value: DestinyHistoricalStatsPeriodGroup, index: number, array: DestinyHistoricalStatsPeriodGroup[]): boolean =>
        (!!value.values.completed.basic.value),
    [FilterOptions.LOWMAN_ONLY]: (value: DestinyHistoricalStatsPeriodGroup, index: number, array: DestinyHistoricalStatsPeriodGroup[]): boolean =>
        (!!value.values.completed.basic.value && value.values.playerCount.basic.value <= 3),
    [FilterOptions.FINISH_OR_FULL_TEAM_5_MIN]: (value: DestinyHistoricalStatsPeriodGroup, index: number, array: DestinyHistoricalStatsPeriodGroup[]): boolean =>
        (!!value.values.completed.basic.value || (value.values.playerCount.basic.value >= 6 && value.values.activityDurationSeconds.basic.value >= 300))
}

export const DefaultPreferences: { [K in Prefs]: PrefType<K> } = {
    [Prefs.FILTER]: AvailableFilterOptions[FilterOptions.FINISH_OR_FULL_TEAM_5_MIN]
}