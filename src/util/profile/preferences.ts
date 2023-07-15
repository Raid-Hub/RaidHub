import { DestinyHistoricalStatsPeriodGroup } from "bungie-net-core/lib/models"
import { FilterCallback } from "../../types/generic"
import Activity from "../../models/profile/Activity"

export enum Prefs {
    FILTER
}

export type PrefType<T extends Prefs> = T extends Prefs.FILTER ? FilterCallback<Activity> : never

export enum FilterOptions {
    SUCCESS_ONLY,
    LOWMAN_ONLY,
    FINISH_OR_FULL_TEAM_5_MIN
}

export const AvailableFilterOptions: {
    [key in FilterOptions]: PrefType<Prefs.FILTER>
} = {
    [FilterOptions.SUCCESS_ONLY]: (value: DestinyHistoricalStatsPeriodGroup): boolean =>
        !!value.values.completed.basic.value,
    [FilterOptions.LOWMAN_ONLY]: (value: DestinyHistoricalStatsPeriodGroup): boolean =>
        !!value.values.completed.basic.value && value.values.playerCount.basic.value <= 3,
    [FilterOptions.FINISH_OR_FULL_TEAM_5_MIN]: (
        value: DestinyHistoricalStatsPeriodGroup
    ): boolean =>
        !!value.values.completed.basic.value ||
        (value.values.playerCount.basic.value >= 6 &&
            value.values.activityDurationSeconds.basic.value >= 300)
}

export const DefaultPreferences: { [K in Prefs]: PrefType<K> } = {
    [Prefs.FILTER]: AvailableFilterOptions[FilterOptions.FINISH_OR_FULL_TEAM_5_MIN]
}

// temporary
export const NewoPrefs: { [K in Prefs]: PrefType<K> } = {
    [Prefs.FILTER]: AvailableFilterOptions[FilterOptions.FINISH_OR_FULL_TEAM_5_MIN]
}
