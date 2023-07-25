import { useEffect, useState } from "react"
import { DefaultActivityFilters, decodeFilters } from "../../util/profile/activityFilters"
import { ActivityFilter } from "../../types/profile"

export const KEY_ACTIVITY_FILTER = "profile_activity_filter"

export const useActivityFilters = (): [
    ActivityFilter | null,
    (filter: ActivityFilter | null) => void
] => {
    const [activeFilter, setActiveFilter] = useState<ActivityFilter | null>(null)

    useEffect(() => {
        const allFilters = localStorage.getItem(KEY_ACTIVITY_FILTER)
        if (allFilters) {
            const cached = decodeFilters(allFilters)
            setActiveFilter(cached)
        } else {
            setActiveFilter(DefaultActivityFilters)
        }
    }, [])

    const saveFilter = (filter: ActivityFilter | null) => {
        filter
            ? localStorage.setItem(KEY_ACTIVITY_FILTER, filter.encode())
            : localStorage.removeItem(KEY_ACTIVITY_FILTER)
    }

    return [
        activeFilter,
        filter => {
            setActiveFilter(filter)
            saveFilter(filter)
        }
    ]
}
