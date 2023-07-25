import { useCallback, useEffect, useRef } from "react"
import styles from "../../../styles/pages/profile/mid.module.css"
import { ActivityFilter } from "../../../types/profile"
import { FilterListName, FiltersToSelectFrom } from "../../../util/profile/activityFilters"
import { useLocale } from "../../app/LanguageProvider"

type FilterSelectorMenuProps = {
    handleSelect(element: ActivityFilter): void
    handleClickAway(): void
}
const FilterSelectorMenu = ({ handleSelect, handleClickAway }: FilterSelectorMenuProps) => {
    const { strings } = useLocale()
    const listRef = useRef<HTMLUListElement | null>(null)

    const handleClickOutside = useCallback(
        (event: MouseEvent) => {
            if (listRef.current && !listRef.current.contains(event.target as Node)) {
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
        <ul ref={listRef} className={styles["filter-selector-menu"]}>
            {Object.entries(FiltersToSelectFrom).map(([key, selection]) => (
                <li key={key} onClick={() => handleSelect(selection())}>
                    {strings.filterNames[Number(key) as FilterListName]}
                </li>
            ))}
        </ul>
    )
}

export default FilterSelectorMenu
