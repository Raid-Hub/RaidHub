import { Dispatch, SetStateAction, forwardRef, useMemo, useRef, useState } from "react"
import styles from "~/styles/pages/profile/mid.module.css"
import { ActivityFilter } from "~/types/profile"
import { useLocale } from "~/components/app/LocaleManager"
import { FilterListName, PresetFilters, decodeFilters } from "~/util/profile/activityFilters"
import { usePortal } from "~/components/reusable/Portal"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"
import CustomFilterBuilder from "./FilterBuilder"
import CustomFilterManager from "./FilterManager"
import { Collection } from "@discordjs/collection"
import Death from "~/images/icons/destiny2/Death"

type FilterSelectorProps = {
    activeFilter: ActivityFilter | null
    setActiveFilter: (filter: ActivityFilter | null) => void
}

enum FilterModalScreen {
    Main,
    Builder,
    Manager
}

const FilterSelector = ({ activeFilter, setActiveFilter }: FilterSelectorProps) => {
    const ref = useRef<HTMLDialogElement | null>(null)
    const { sendThroughPortal } = usePortal()

    const [screen, setScreen] = useState(FilterModalScreen.Main)

    const closeModal = () => ref?.current?.close()

    const { strings } = useLocale()

    return (
        <div className={styles["filter-view"]}>
            <div
                className={styles["filter-view-content"]}
                onClick={() => {
                    if (!ref.current?.open) {
                        ref.current?.showModal()
                    }
                }}>
                <h4>{strings.manageFilters}</h4>
            </div>
            {/* Render this HTML dialog somewhere else defined by the portal Context */}
            {sendThroughPortal(
                <FilterModal
                    ref={ref}
                    pendingFilter={activeFilter}
                    screen={screen}
                    setScreen={setScreen}
                    setPendingFilter={setActiveFilter}
                    closeModal={closeModal}
                />
            )}
        </div>
    )
}

const defaultSavedFilters = new Array<{ name: string; data: Object }>()
interface FilterModalProps {
    pendingFilter: ActivityFilter | null
    setPendingFilter: (filter: ActivityFilter | null) => void
    screen: FilterModalScreen
    setScreen: Dispatch<SetStateAction<FilterModalScreen>>
    closeModal(): void
}
const FilterModal = forwardRef<HTMLDialogElement, FilterModalProps>((props, ref) => {
    const { strings } = useLocale()
    const [selectedFilter, setSelectedFilter] = useLocalStorage<FilterListName | string>(
        "selected-filter-name",
        FilterListName.Default
    )
    const [savedFilters, saveFilters] = useLocalStorage("saved-filters", defaultSavedFilters)
    const mySavedfilters = useMemo(
        () =>
            new Collection(
                savedFilters
                    .map(f => [f.name, decodeFilters(f.data)])

                    .filter(([_, filter]) => Boolean(filter)) as [string, ActivityFilter][]
            ),
        [savedFilters]
    )

    const deleteFilter = (name: string) => {
        mySavedfilters.delete(name.toLowerCase())
        saveFilters(mySavedfilters.map((filter, name) => ({ data: filter.encode(), name })))
    }

    const saveNewFilter = (name: string, newFilter: ActivityFilter) => {
        if (mySavedfilters.has(name.toLowerCase())) {
            return false
        } else {
            mySavedfilters.set(name.toLowerCase(), newFilter)
            saveFilters(mySavedfilters.map((filter, name) => ({ data: filter.encode(), name })))
            return true
        }
    }

    return (
        <dialog className={styles["filter-selector"]} ref={ref}>
            <div className={styles["filter-selector-container"]}>
                {props.screen == 0 ? (
                    <div className={styles["filter-selector-main"]}>
                        <nav className={styles["filter-selector-nav"]} onClick={props.closeModal}>
                            <Death
                                color="white"
                                sx={20}
                                className={styles["filter-selector-nav-arrow"]}
                            />
                            <span>Close</span>
                        </nav>
                        <h3>Select Filter</h3>
                        <div className={styles["filter-presets"]}>
                            {Object.entries(PresetFilters).map(([filterName, generator]) => {
                                const filterKey = Number(filterName) as FilterListName
                                const isSelected = filterKey === selectedFilter
                                return (
                                    <button
                                        key={filterName}
                                        aria-current={isSelected}
                                        className={styles["filter-preset-button"]}
                                        onClick={() => {
                                            setSelectedFilter(filterKey)
                                            props.setPendingFilter(generator?.() ?? null)
                                        }}>
                                        {strings.filterNames[Number(filterName) as FilterListName]}
                                    </button>
                                )
                            })}
                            {mySavedfilters.map((filter, filterName) => {
                                const isSelected = filterName === selectedFilter
                                return (
                                    <button
                                        key={filterName}
                                        aria-current={isSelected}
                                        className={styles["filter-preset-button"]}
                                        onClick={() => {
                                            setSelectedFilter(filterName)
                                            props.setPendingFilter(filter)
                                        }}>
                                        {filterName}
                                    </button>
                                )
                            })}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                gap: "1em",
                                flexWrap: "wrap",
                                justifyContent: "center"
                            }}>
                            <button
                                onClick={() => props.setScreen(FilterModalScreen.Builder)}
                                className={styles["filter-selector-builder-button"]}>
                                Open Custom Filter Builder
                            </button>
                            <button
                                onClick={() => props.setScreen(FilterModalScreen.Manager)}
                                className={styles["filter-selector-builder-button"]}>
                                Manage Custom Filters
                            </button>
                        </div>
                    </div>
                ) : props.screen == FilterModalScreen.Builder ? (
                    <CustomFilterBuilder
                        returnToMain={() => props.setScreen(FilterModalScreen.Main)}
                        saveNewFilter={saveNewFilter}
                    />
                ) : (
                    <CustomFilterManager
                        returnToMain={() => props.setScreen(FilterModalScreen.Main)}
                        savedFilters={mySavedfilters}
                        deleteFilter={deleteFilter}
                    />
                )}
            </div>
        </dialog>
    )
})
FilterModal.displayName = "FilterModal"

export default FilterSelector
