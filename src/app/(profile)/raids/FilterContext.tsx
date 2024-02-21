import {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useState,
    type Dispatch,
    type ReactNode
} from "react"
import {
    decodeFilters,
    getDefaultActivityFilters,
    type ActivityFilter,
    type FilterPredicate
} from "~/app/(profile)/raids/filters/activityFilters"

const FilterContext = createContext<
    | {
          filterPredicate: FilterPredicate | null
          setFilter: Dispatch<ActivityFilter | null>
          isMounted: boolean
      }
    | undefined
>(undefined)

export const useFilterContext = () => {
    const ctx = useContext(FilterContext)
    if (!ctx) throw new Error("No FilterContext found")
    return ctx
}

/**
 * Saves the activity filter to local storage.
 *
 * @param _ - The previous activity filter.
 * @param filter - The new activity filter to save.
 * @returns The saved activity filter.
 */
const saveFilter = (_: ActivityFilter | null, filter: ActivityFilter | null) => {
    localStorage.setItem(KEY_ACTIVITY_FILTER, JSON.stringify(filter ? filter.encode() : null))
    return filter
}

/**
 * Provides the context for filtering activities.
 * @param children - The child components.
 * @returns The filtered activities context provider.
 */
export const FilterContextProvider = ({ children }: { children: ReactNode }) => {
    const [filter, setFilter] = useReducer(saveFilter, undefined, getDefaultActivityFilters)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        const allFilters = localStorage.getItem(KEY_ACTIVITY_FILTER)
        if (allFilters !== null) {
            const cached = decodeFilters(JSON.parse(allFilters))
            setFilter(cached)
        }
        setIsMounted(true)
    }, [])

    return (
        <FilterContext.Provider
            value={{
                setFilter: (newFilter: ActivityFilter | null) => setFilter(newFilter),
                filterPredicate: filter?.predicate.bind(filter) ?? null,
                isMounted
            }}>
            {children}
        </FilterContext.Provider>
    )
}

export const KEY_ACTIVITY_FILTER = "profile_activity_filter_new"
