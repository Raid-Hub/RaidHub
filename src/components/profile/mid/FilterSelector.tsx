import { Dispatch, SetStateAction } from "react"
import styles from "../../../styles/pages/profile/mid.module.css"
import { FilterCallback } from "../../../types/generic"
import { ExtendedActivity } from "../../../util/profile/activityFilters"

type FilterSelectorProps = {
    activeFilters: FilterCallback<ExtendedActivity>[]
    setActiveFilters: Dispatch<SetStateAction<FilterCallback<ExtendedActivity>[]>>
}

const FilterSelector = ({ activeFilters, setActiveFilters }: FilterSelectorProps) => {
    return <div className={styles["filter-selector"]}>Selector</div>
}

export default FilterSelector
