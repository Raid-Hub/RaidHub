import React, { useState } from "react"
import styles from "../../../styles/pages/profile/mid.module.css"
import { ActivityFilter } from "../../../types/profile"
import ActivityFilterBuilder from "../../../models/profile/ActivityFilterBuilder"
import NotActivityFilter from "../../../models/profile/NotActivityFilter"
import HighOrderActivityFilter from "../../../models/profile/HighOrderActivityFilter"
import SingleActivityFilter from "../../../models/profile/SingleActivityFilter"
import FilterSelectorMenu from "./FilterSelectorMenu"

type FilterSelectorProps = {
    activeFilter: ActivityFilter | null
    setActiveFilter: (filter: ActivityFilter | null) => void
}

const FilterSelector = ({ activeFilter, setActiveFilter }: FilterSelectorProps) => {
    const [currentFilter, setCurrentFilter] = useState(activeFilter?.deepClone() ?? null)
    const [isShowingSelect, setIsShowingSelect] = useState(false)
    const handleButtonPress = (save?: boolean) => {
        if (save) {
            setActiveFilter(currentFilter?.deepClone() ?? null)
        } else if (isEditing) {
            setCurrentFilter(activeFilter?.deepClone() ?? null)
        }
        setIsEditing(old => !old)
    }

    const refreshCurrentFilter = () => setCurrentFilter(old => old?.deepClone() ?? null)

    const [isEditing, setIsEditing] = useState(false)

    const removeFilter = () => {
        setCurrentFilter(null)
    }
    return (
        <div className={styles["filter-selector"]}>
            {isEditing && <button onClick={() => setIsShowingSelect(true)}>New</button>}
            {currentFilter ? (
                <GenericFilterComponent
                    filter={currentFilter}
                    isEditing={isEditing}
                    depth={0}
                    canRemove={true}
                    removeFromParent={removeFilter}
                    refreshCurrentFilter={refreshCurrentFilter}
                />
            ) : (
                <div>No Filter</div>
            )}
            {isEditing ? (
                <>
                    <button onClick={() => handleButtonPress(true)}>Save</button>
                    {/* <button onClick={() => handleButtonPress(true)}>Save New</button> */}
                    <button onClick={() => handleButtonPress(false)}>Cancel</button>
                </>
            ) : (
                <button type="button" onClick={() => handleButtonPress(false)}>
                    Edit
                </button>
            )}
            {isShowingSelect && (
                <FilterSelectorMenu
                    handleSelect={newFilter => {
                        setIsShowingSelect(false)
                        setCurrentFilter(newFilter)
                    }}
                    handleClickAway={() => setIsShowingSelect(false)}
                />
            )}
        </div>
    )
}

type GenericFilterComponentProps<F extends ActivityFilter = ActivityFilter> = {
    filter: F
    isEditing: boolean
    depth: number
    canRemove: boolean
    removeFromParent?(): void
    refreshCurrentFilter(): void
}

const GenericFilterComponent = (props: GenericFilterComponentProps) => {
    if (props.filter instanceof ActivityFilterBuilder) {
        return <BuilderFilterComponent {...props} filter={props.filter} />
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

const BuilderFilterComponent = ({
    isEditing,
    canRemove,
    filter,
    depth,
    removeFromParent,
    refreshCurrentFilter
}: GenericFilterComponentProps<ActivityFilterBuilder>) => {
    const [isShowingSelect, setIsShowingSelect] = useState(false)
    const removeChild = (id: string) => {
        filter.children.delete(id)
        refreshCurrentFilter()
    }
    return (
        <div className={styles["filter-item"]}>
            {canRemove && isEditing && (
                <button className={styles["filter-remove-btn"]} onClick={removeFromParent}>
                    X
                </button>
            )}
            {Array.from(filter.children).map(([id, childFilter], idx) => (
                <React.Fragment key={id}>
                    <GenericFilterComponent
                        filter={childFilter}
                        isEditing={isEditing}
                        depth={depth + 1}
                        canRemove={true}
                        removeFromParent={() => removeChild(id)}
                        refreshCurrentFilter={refreshCurrentFilter}
                    />
                    {(isEditing || idx < filter.children.size - 1) && (
                        <div className={styles["filter-combinator"]}>
                            {filter.combinator == "|" ? "OR" : "AND"}
                        </div>
                    )}
                </React.Fragment>
            ))}
            {isEditing && <button onClick={() => setIsShowingSelect(true)}>+</button>}
            {isShowingSelect && (
                <FilterSelectorMenu
                    handleSelect={newFilter => {
                        setIsShowingSelect(false)
                        filter.children.set(newFilter.id, newFilter)
                        refreshCurrentFilter()
                    }}
                    handleClickAway={() => setIsShowingSelect(false)}
                />
            )}
        </div>
    )
}

const NotFilterComponent = ({
    canRemove,
    isEditing,
    filter,
    depth,
    removeFromParent,
    refreshCurrentFilter
}: GenericFilterComponentProps<NotActivityFilter>) => {
    const [isShowingSelect, setIsShowingSelect] = useState(false)

    const removeChild = () => {
        filter.child = null
        refreshCurrentFilter()
    }
    return (
        <div className={[styles["filter-item"], styles["filter-not"]].join(" ")}>
            {canRemove && isEditing && (
                <button className={styles["filter-remove-btn"]} onClick={removeFromParent}>
                    X
                </button>
            )}
            <div className={styles["filter-combinator"]}>{"NOT"}</div>
            {filter.child ? (
                <GenericFilterComponent
                    filter={filter.child}
                    isEditing={isEditing}
                    depth={depth + 1}
                    canRemove={true}
                    removeFromParent={removeChild}
                    refreshCurrentFilter={refreshCurrentFilter}
                />
            ) : (
                isEditing && <button onClick={() => setIsShowingSelect(true)}>+</button>
            )}
            {isShowingSelect && (
                <FilterSelectorMenu
                    handleSelect={newFilter => {
                        setIsShowingSelect(false)
                        filter.child = newFilter
                        refreshCurrentFilter()
                    }}
                    handleClickAway={() => setIsShowingSelect(false)}
                />
            )}
        </div>
    )
}

const HighOrderFilterComponent = ({
    canRemove,
    isEditing,
    filter,
    removeFromParent
}: GenericFilterComponentProps<HighOrderActivityFilter>) => {
    return (
        <div className={styles["filter-item"]}>
            {canRemove && isEditing && (
                <button className={styles["filter-remove-btn"]} onClick={removeFromParent}>
                    X
                </button>
            )}
            <p>{filter.key}</p>
            <p>
                <b>{filter.value}</b>
            </p>
        </div>
    )
}

const SingleFilterComponent = ({
    canRemove,
    filter,
    isEditing,
    removeFromParent
}: GenericFilterComponentProps<SingleActivityFilter>) => {
    return (
        <div className={styles["filter-item"]}>
            {canRemove && isEditing && (
                <button className={styles["filter-remove-btn"]} onClick={removeFromParent}>
                    X
                </button>
            )}
            <p>{filter.key}</p>
        </div>
    )
}

export default FilterSelector
