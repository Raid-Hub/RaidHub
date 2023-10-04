import React, { useRef, useState } from "react"
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
import { usePortal } from "~/components/reusable/Portal"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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
        ref.current?.close()
    }

    const refreshCurrentFilter = () => setCurrentFilter(old => old?.deepClone() ?? null)

    const removeFilter = () => setCurrentFilter(null)

    const ref = useRef<HTMLDialogElement | null>(null)
    const { sendThroughPortal } = usePortal()

    return (
        <div className={styles["filter-view"]}>
            <div
                className={styles["filter-view-content"]}
                onClick={() => !ref.current?.open && ref.current?.showModal()}>
                <h4>{strings.manageFilters}</h4>
            </div>

            {sendThroughPortal(
                <dialog className={styles["filter-selector"]} ref={ref}>
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
                </dialog>
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
    const { handleSubmit, register, formState } = useForm({
        defaultValues: {
            value: filter.value
        },
        resolver: zodResolver(z.object({ value: filter.schema }))
    })
    const enteredValue = async ({ value }: { value: unknown }) => {
        filter.value = value
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
                <input
                    type={filter.inputType}
                    inputMode={filter.inputMode}
                    id="value"
                    {...register("value")}
                />
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
