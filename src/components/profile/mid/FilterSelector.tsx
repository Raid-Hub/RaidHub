import React, { useMemo, useState } from "react"
import styles from "../../../styles/pages/profile/mid.module.css"
import { ActivityFilter } from "../../../types/profile"
import GroupActivityFilter from "../../../models/profile/filters/GroupActivityFilter"
import NotActivityFilter from "../../../models/profile/filters/NotActivityFilter"
import HighOrderActivityFilter from "../../../models/profile/filters/HighOrderActivityFilter"
import SingleActivityFilter from "../../../models/profile/filters/SingleActivityFilter"
import FilterSelectorMenu from "./FilterSelectorMenu"
import { useLocale } from "../../app/LocaleManager"
import { DefaultActivityFilters } from "../../../util/profile/activityFilters"
import { useForm } from "react-hook-form"

type FilterSelectorProps = {
    activeFilter: ActivityFilter | null
    setActiveFilter: (filter: ActivityFilter | null) => void
}

const FilterSelector = ({ activeFilter, setActiveFilter }: FilterSelectorProps) => {
    const { strings } = useLocale()
    const [currentFilter, setCurrentFilter] = useState(activeFilter?.deepClone() ?? null)
    const [handleSelect, _setHandleSelect] = useState<((newFilter: ActivityFilter) => void) | null>(
        null
    )
    // have to do this because state handlers cant directly accept a function
    const setHandleSelect = (handler: ((newFilter: ActivityFilter) => void) | null): void => {
        _setHandleSelect((_: any) => handler)
    }

    const handleCloseEditModal = (save: boolean) => {
        if (save) {
            setActiveFilter(currentFilter?.deepClone() ?? null)
        } else {
            setCurrentFilter(activeFilter?.deepClone() ?? null)
        }
        setIsEditing(false)
    }

    const refreshCurrentFilter = () => setCurrentFilter(old => old?.deepClone() ?? null)

    const [isEditing, setIsEditing] = useState(false)

    const removeFilter = () => setCurrentFilter(null)

    const activeFilterStr = useMemo(() => {
        const str = activeFilter?.stringify() ?? strings.none
        if (str.length > 20) {
            return strings.clickToView
        } else {
            return str
        }
    }, [activeFilter, strings])

    return (
        <div className={styles["filter-view"]} onClick={() => !isEditing && setIsEditing(true)}>
            <div className={styles["filter-view-content"]}>
                <h3>{strings.activeFilters}</h3>
                <div className={styles["filter-view-desc"]}>{activeFilterStr}</div>
            </div>

            {isEditing && (
                <div className={styles["filter-selector"]}>
                    <div className={styles["filter-selector-buttons"]}>
                        <button onClick={() => handleCloseEditModal(true)}>Save</button>
                        <button onClick={() => handleCloseEditModal(false)}>Cancel</button>
                        <button onClick={() => removeFilter()}>Clear</button>
                        <button onClick={() => setCurrentFilter(DefaultActivityFilters)}>
                            Reset to Default
                        </button>
                    </div>
                    {currentFilter ? (
                        <GenericFilterComponent
                            filter={currentFilter}
                            depth={0}
                            canRemove={true}
                            removeFromParent={removeFilter}
                            refreshCurrentFilter={refreshCurrentFilter}
                            setHandleSelect={setHandleSelect}
                        />
                    ) : (
                        <div className={styles["no-filter"]}>
                            <div>No Filter</div>
                            <button
                                onClick={() => {
                                    setHandleSelect((newFilter: ActivityFilter) => {
                                        setCurrentFilter(newFilter)
                                    })
                                }}>
                                +
                            </button>
                        </div>
                    )}
                    {handleSelect && (
                        <FilterSelectorMenu
                            handleSelect={e => {
                                handleSelect?.(e)
                                setHandleSelect(null)
                            }}
                            handleClickAway={() => setHandleSelect(null)}
                        />
                    )}
                </div>
            )}
        </div>
    )
}

type GenericFilterComponentProps<F extends ActivityFilter = ActivityFilter> = {
    filter: F
    depth: number
    canRemove: boolean
    removeFromParent?(): void
    refreshCurrentFilter(): void
    setHandleSelect(handler: (newFilter: ActivityFilter) => void): void
}

const GenericFilterComponent = (props: GenericFilterComponentProps) => {
    if (props.filter instanceof GroupActivityFilter) {
        return <GroupFilterComponent {...props} filter={props.filter} />
    } else if (props.filter instanceof NotActivityFilter) {
        return <NotFilterComponent {...props} filter={props.filter} />
    } else if (props.filter instanceof HighOrderActivityFilter) {
        return <HighOrderFilterComponent {...props} filter={props.filter} />
    } else if (props.filter instanceof SingleActivityFilter) {
        return <SingleFilterComponent {...props} filter={props.filter} />
    } else {
        return null
    }
}

const GroupFilterComponent = ({
    canRemove,
    filter,
    depth,
    removeFromParent,
    refreshCurrentFilter,
    setHandleSelect
}: GenericFilterComponentProps<GroupActivityFilter>) => {
    const removeChild = (id: string) => {
        filter.children.delete(id)
        refreshCurrentFilter()
    }
    return (
        <div className={styles["filter-item"]}>
            {canRemove && (
                <button className={styles["filter-remove-btn"]} onClick={removeFromParent}>
                    X
                </button>
            )}
            {filter.children.size === 0 && (
                <div className={styles["filter-combinator"]}>
                    {filter.combinator == "|" ? "OR" : "AND"}
                </div>
            )}
            {Array.from(filter.children).map(([id, childFilter], idx) => (
                <React.Fragment key={id}>
                    <GenericFilterComponent
                        filter={childFilter}
                        depth={depth + 1}
                        canRemove={true}
                        removeFromParent={() => removeChild(id)}
                        refreshCurrentFilter={refreshCurrentFilter}
                        setHandleSelect={setHandleSelect}
                    />
                    <div className={styles["filter-combinator"]}>
                        {filter.combinator == "|" ? "OR" : "AND"}
                    </div>
                </React.Fragment>
            ))}
            <button
                onClick={() => {
                    setHandleSelect(newFilter => {
                        filter.children.set(newFilter.id, newFilter)
                        refreshCurrentFilter()
                    })
                }}>
                +
            </button>
        </div>
    )
}

const NotFilterComponent = ({
    canRemove,
    filter,
    depth,
    removeFromParent,
    refreshCurrentFilter,
    setHandleSelect
}: GenericFilterComponentProps<NotActivityFilter>) => {
    const removeChild = () => {
        filter.child = null
        refreshCurrentFilter()
    }
    return (
        <div className={[styles["filter-item"], styles["filter-not"]].join(" ")}>
            {canRemove && (
                <button className={styles["filter-remove-btn"]} onClick={removeFromParent}>
                    X
                </button>
            )}
            <div className={styles["filter-combinator"]}>{"NOT"}</div>
            {filter.child ? (
                <GenericFilterComponent
                    filter={filter.child}
                    depth={depth + 1}
                    canRemove={true}
                    removeFromParent={removeChild}
                    refreshCurrentFilter={refreshCurrentFilter}
                    setHandleSelect={setHandleSelect}
                />
            ) : (
                <button
                    onClick={() =>
                        setHandleSelect(newFilter => {
                            filter.child = newFilter
                        })
                    }>
                    +
                </button>
            )}
        </div>
    )
}

const HighOrderFilterComponent = ({
    canRemove,
    filter,
    removeFromParent
}: GenericFilterComponentProps<HighOrderActivityFilter>) => {
    const { strings } = useLocale()
    const { handleSubmit, register } = useForm({
        defaultValues: {
            value: filter.value
        }
    })
    const enteredValue = async ({ value }: { value: any }) => {
        filter.value = Number(value)
    }

    return (
        <div className={styles["filter-item"]}>
            {canRemove && (
                <button className={styles["filter-remove-btn"]} onClick={removeFromParent}>
                    X
                </button>
            )}
            <p>{strings.activityFilters[filter.key]}</p>
            <form onSubmit={handleSubmit(enteredValue)}>
                <input type="number" id="value" inputMode="numeric" {...register("value")} />
                <button type="submit">save</button>
            </form>
        </div>
    )
}

const SingleFilterComponent = ({
    canRemove,
    filter,
    removeFromParent
}: GenericFilterComponentProps<SingleActivityFilter>) => {
    return (
        <div className={styles["filter-item"]}>
            {canRemove && (
                <button className={styles["filter-remove-btn"]} onClick={removeFromParent}>
                    X
                </button>
            )}
            <p>{filter.key}</p>
        </div>
    )
}

export default FilterSelector
