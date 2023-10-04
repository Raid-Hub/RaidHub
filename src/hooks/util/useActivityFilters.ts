import { useEffect, useState } from "react"
import { DefaultActivityFilters, decodeFilters } from "../../util/profile/activityFilters"
import { ActivityFilter } from "../../types/profile"

export const KEY_ACTIVITY_FILTER = "profile_activity_filter"

export const useActivityFilters = () => {
    const [activeFilter, setFilter] = useState<ActivityFilter | null>(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        const allFilters = localStorage.getItem(KEY_ACTIVITY_FILTER)
        if (allFilters !== null) {
            const cached = decodeFilters(JSON.parse(allFilters))
            setActiveFilter(cached)
        } else {
            setActiveFilter(DefaultActivityFilters)
        }
        setIsMounted(true)
    }, [])

    const saveFilter = (filter: ActivityFilter | null) => {
        localStorage.setItem(KEY_ACTIVITY_FILTER, JSON.stringify(filter ? filter.encode() : null))
    }

    const setActiveFilter = (filter: ActivityFilter | null) => {
        setFilter(filter)
        saveFilter(filter)
    }

    return {
        activeFilter,
        setActiveFilter,
        isFilterMounted: isMounted,
        clear: () => localStorage.removeItem(KEY_ACTIVITY_FILTER)
    }
}
