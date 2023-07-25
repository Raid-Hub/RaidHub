import { useCallback, useEffect, useRef } from "react"
import styles from "../../../styles/pages/profile/mid.module.css"
import { ActivityFilter } from "../../../types/profile"
import { FiltersToSelectFrom } from "../../../util/profile/activityFilters"

type FilterSelectorMenuProps = {
    handleSelect(element: ActivityFilter): void
    handleClickAway(): void
}
const FilterSelectorMenu = ({ handleSelect, handleClickAway }: FilterSelectorMenuProps) => {
    const divRef = useRef<HTMLDivElement | null>(null)

    const handleClickOutside = useCallback(
        (event: MouseEvent) => {
            if (divRef.current && !divRef.current.contains(event.target as Node)) {
                handleClickAway()
            }
        },
        [handleClickAway]
    )

    useEffect(() => {
        const timer = setTimeout(() => document.addEventListener("click", handleClickOutside), 300)

        return () => {
            clearTimeout(timer)
            document.removeEventListener("click", handleClickOutside)
        }
    }, [handleClickOutside])

    return (
        <div ref={divRef} className={styles["filter-selector-menu"]}>
            {FiltersToSelectFrom.map((selection, key) => (
                <div key={key} onClick={() => handleSelect(selection())}>
                    {key}
                </div>
            ))}
        </div>
    )
}

export default FilterSelectorMenu
