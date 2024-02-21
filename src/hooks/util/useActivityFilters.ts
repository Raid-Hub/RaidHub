import { useEffect, useState } from "react"
import {
    DefaultActivityFilters,
    decodeFilters
} from "../../app/(profile)/raids/filters/activityFilters"
import { ActivityFilter } from "../../types/profile"

export const KEY_ACTIVITY_FILTER = "profile_activity_filter"

export const useActivityFilters = () => {
    const [activeFilter, setFilter] = useState<ActivityFilter | null>(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        const allFilters = localStorage.getItem(KEY_ACTIVITY_FILTER)
        if (allFilters !== null) {
            const cached = decodeFilters(JSON.parse(allFilters))
            setFilter(cached)
        } else {
            setFilter(DefaultActivityFilters)
        }
        setIsMounted(true)
    }, [setFilter])

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
