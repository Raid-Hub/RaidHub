import {
    Dispatch,
    Fragment,
    SetStateAction,
    forwardRef,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react"
import styles from "~/styles/pages/profile/mid.module.css"
import { ActivityFilter } from "~/types/profile"
import { useLocale } from "~/components/app/LocaleManager"
import { FilterListName, PresetFilters, decodeFilters } from "~/util/profile/activityFilters"
import { usePortal } from "~/components/reusable/Portal"
import { useLocalStorage } from "~/hooks/util/useLocalStorage"
import CustomFilterBuilder from "./FilterBuilder"

type FilterSelectorProps = {
    activeFilter: ActivityFilter | null
    setActiveFilter: (filter: ActivityFilter | null) => void
}

enum FilterModalScreen {
    Main,
    Builder
}

const FilterSelector = ({ activeFilter, setActiveFilter }: FilterSelectorProps) => {
    const ref = useRef<HTMLDialogElement | null>(null)
    const { sendThroughPortal } = usePortal()

    const [pendingFilter, setPendingFilter] = useState<ActivityFilter | null>(null)
    const [screen, setScreen] = useState(FilterModalScreen.Main)

    const closeModal = () => ref?.current?.close()

    const handleCloseEditModal = (save: boolean) => {
        if (save) {
            setActiveFilter(pendingFilter ?? null)
        } else {
            setPendingFilter(null)
        }
        closeModal()
    }

    const { strings } = useLocale()

    return (
        <div className={styles["filter-view"]}>
            <div
                className={styles["filter-view-content"]}
                onClick={() => {
                    if (!ref.current?.open) {
                        ref.current?.showModal()
                        setPendingFilter(activeFilter)
                    }
                }}>
                <h4>{strings.manageFilters}</h4>
            </div>
            {/* Render this HTML dialog somewhere else defined by the portal Context */}
            {sendThroughPortal(
                <FilterModal
                    ref={ref}
                    pendingFilter={pendingFilter}
                    screen={screen}
                    setScreen={setScreen}
                    setPendingFilter={setPendingFilter}
                    handleSave={() => handleCloseEditModal(true)}
                    handleCancel={() => handleCloseEditModal(false)}
                />
            )}
        </div>
    )
}

const defaultSavedFilters = new Array<{ name: string; data: Object }>()
interface FilterModalProps {
    pendingFilter: ActivityFilter | null
    setPendingFilter: Dispatch<SetStateAction<ActivityFilter | null>>
    screen: FilterModalScreen
    setScreen: Dispatch<SetStateAction<FilterModalScreen>>
    handleSave(): void
    handleCancel(): void
}
const FilterModal = forwardRef<HTMLDialogElement, FilterModalProps>((props, ref) => {
    const { strings } = useLocale()
    const { value: selectedFilter, save: setSelectedFilter } = useLocalStorage<
        FilterListName | string
    >("selected-filter-name", FilterListName.Default)
    const { save: saveFilters, value: savedFilters } = useLocalStorage(
        "saved-filters",
        defaultSavedFilters
    )

    const mySavedfilters = useMemo(
        () =>
            savedFilters
                .map(f => ({ filterName: f.name, filter: decodeFilters(f.data) }))
                .filter(({ filter }) => Boolean(filter)) as {
                filterName: string
                filter: ActivityFilter
            }[],
        [savedFilters]
    )

    return (
        <dialog className={styles["filter-selector"]} ref={ref}>
            {props.screen == 0 ? (
                <div className={styles["filter-selector-main"]}>
                    <div className={styles["filter-selector-buttons"]}>
                        <button onClick={props.handleSave}>Save</button>
                        <button onClick={props.handleCancel}>Cancel</button>
                    </div>
                    <hr
                        style={{
                            width: "90%",
                            margin: "0.4em",
                            borderColor: "--var(border-color)"
                        }}
                    />
                    <div className={styles["filter-presets"]}>
                        {Object.entries(PresetFilters).map(([filterName, generator]) => {
                            const filterKey = Number(filterName) as FilterListName
                            const isSelected = filterKey === selectedFilter
                            return (
                                <button
                                    key={filterName}
                                    aria-selected={isSelected}
                                    className={styles["filter-preset-button"]}
                                    onClick={() => {
                                        setSelectedFilter(filterKey)
                                        props.setPendingFilter(generator?.() ?? null)
                                    }}>
                                    {strings.filterNames[Number(filterName) as FilterListName]}
                                </button>
                            )
                        })}
                        {mySavedfilters.map(({ filterName, filter }, idx) => {
                            const isSelected = filterName === selectedFilter
                            return (
                                <button
                                    key={idx}
                                    aria-selected={isSelected}
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
                    <hr
                        style={{
                            width: "90%",
                            margin: "0.4em",
                            borderColor: "--var(border-color)"
                        }}
                    />
                    <button onClick={() => props.setScreen(FilterModalScreen.Builder)}>
                        Open Custom Filter Builder
                    </button>
                </div>
            ) : (
                <CustomFilterBuilder
                    returnToMain={() => props.setScreen(FilterModalScreen.Main)}
                    saveNewFilter={(name, newFilter) => {
                        saveFilters(old => [
                            ...old,
                            {
                                name: name,
                                data: newFilter.encode()
                            }
                        ])
                    }}
                />
            )}
        </dialog>
    )
})

export default FilterSelector
