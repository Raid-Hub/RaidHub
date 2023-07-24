import { FormEventHandler, useState } from "react"
import styles from "../../../styles/pages/profile/mid.module.css"
import { DefaultActivityFilters } from "../../../util/profile/activityFilters"
import { ActivityFilter } from "../../../types/profile"
import ActivityFilterBuilder from "../../../models/profile/ActivityFilterBuilder"
import NotActivityFilter from "../../../models/profile/NotActivityFilter"
import HighOrderActivityFilter from "../../../models/profile/HighOrderActivityFilter"
import SingleActivityFilter from "../../../models/profile/SingleActivityFilter"

type FilterSelectorProps = {
    activeFilter: ActivityFilter
    setActiveFilter: (filter: ActivityFilter) => void
}

const FilterSelector = ({ activeFilter, setActiveFilter }: FilterSelectorProps) => {
    const [selectedFilter, setSelectedFilter] = useState<ActivityFilter>(activeFilter)
    const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault()
        setActiveFilter(selectedFilter)
    }

    return (
        <form onSubmit={handleSubmit} className={styles["filter-selector"]}>
            <FilterBuilderComponent filter={selectedFilter} />
            <button type="submit">Submit</button>
        </form>
    )
}

const FilterBuilderComponent = ({ filter }: { filter: ActivityFilter }) => {
    if (filter instanceof ActivityFilterBuilder) {
        return (
            <div>
                {filter.children.map((childFilter, idx) => (
                    <FilterBuilderComponent key={idx} filter={childFilter} />
                ))}
            </div>
        )
    } else if (filter instanceof NotActivityFilter) {
        return (
            <div>
                <FilterBuilderComponent filter={filter.child} />
            </div>
        )
    } else if (filter instanceof HighOrderActivityFilter) {
        return <div>{filter.key}</div>
    } else if (filter instanceof SingleActivityFilter) {
        return <div>{filter.key}</div>
    } else {
        return null
    }
}

export default FilterSelector
