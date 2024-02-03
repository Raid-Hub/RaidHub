import { useRef } from "react"
import { useClickOutside } from "~/hooks/util/useClickOutside"
import styles from "~/styles/pages/profile/mid.module.css"
import { ActivityFilter } from "~/types/profile"
import { FilterListName, FiltersToSelectFrom } from "~/util/profile/activityFilters"

type FilterSelectorMenuProps = {
    handleSelect(element: ActivityFilter): void
    handleClickAway(): void
}
const FilterSelectorMenu = ({ handleSelect, handleClickAway }: FilterSelectorMenuProps) => {
    const listRef = useRef<HTMLDivElement | null>(null)

    useClickOutside({ ref: listRef, lockout: 200, enabled: true }, handleClickAway)

    return (
        <div ref={listRef} className={styles["filter-selector-menu"]}>
            <h4>Click on a block below to add it to the filter</h4>
            <ul>
                {Object.entries(FiltersToSelectFrom).map(([key, generate]) => (
                    <li key={key} onClick={() => handleSelect(generate())}>
                        {strings.filterNames[Number(key) as FilterListName]}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default FilterSelectorMenu
