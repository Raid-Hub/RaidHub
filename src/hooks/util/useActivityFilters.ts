import { useEffect, useState } from "react"
import { DefaultActivityFilters, decodeFilters } from "../../util/profile/activityFilters"
import { ActivityFilter } from "../../types/profile"

export const KEY_ACTIVITY_FILTER = "profile_activity_filter"

export const useActivityFilters = (): [
    ActivityFilter | null,
    (filter: ActivityFilter | null) => void,
    boolean
] => {
    const [activeFilter, setActiveFilter] = useState<ActivityFilter | null>(null)
    const [isLoadingSavedFilter, setIsLoadingSavedFilter] = useState(true)

    useEffect(() => {
        const allFilters = localStorage.getItem(KEY_ACTIVITY_FILTER)
        if (allFilters !== null) {
            const cached = decodeFilters(JSON.parse(allFilters))
            setActiveFilter(cached)
        } else {
            setActiveFilter(DefaultActivityFilters)
        }
        setIsLoadingSavedFilter(false)
    }, [])

    const saveFilter = (filter: ActivityFilter | null) => {
        localStorage.setItem(KEY_ACTIVITY_FILTER, JSON.stringify(filter ? filter.encode() : null))
    }

    return [
        activeFilter,
        filter => {
            setActiveFilter(filter)
            saveFilter(filter)
        },
        isLoadingSavedFilter
    ]
}
