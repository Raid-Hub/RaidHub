import { ChangeEvent, Dispatch, FormEventHandler, SetStateAction, useState } from "react"
import styles from "../../../styles/pages/profile/mid.module.css"
import { FilterCallback } from "../../../types/generic"
import {
    AvailableFilterOptions,
    ExtendedActivity,
    FilterOptions
} from "../../../util/profile/activityFilters"
import { useLocale } from "../../app/LanguageProvider"
import { Collection } from "@discordjs/collection"

type FilterSelectorProps = {
    initialActiveFilters: Collection<string, FilterCallback<ExtendedActivity>>
    setActiveFilters: Dispatch<SetStateAction<Collection<string, FilterCallback<ExtendedActivity>>>>
}

const FilterSelector = ({ initialActiveFilters, setActiveFilters }: FilterSelectorProps) => {
    const [selectedFilters, setSelectedFilters] =
        useState<Collection<string, FilterCallback<ExtendedActivity>>>(initialActiveFilters)
    const handleInputChange = (
        key: string,
        filter: FilterCallback<ExtendedActivity>,
        selected: boolean
    ) => {
        setSelectedFilters(old => {
            if (selected) {
                old.set(key, filter)
            } else {
                old.delete(key)
            }
            return old
        })
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault()
        setActiveFilters(selectedFilters.clone())
    }

    return (
        <div className={styles["filter-selector"]}>
            <form onSubmit={handleSubmit}>
                <Checkbox
                    initialValue={false}
                    id={FilterOptions.SUCCESS}
                    onChange={selected =>
                        handleInputChange(
                            "success",
                            AvailableFilterOptions[FilterOptions.SUCCESS],
                            selected
                        )
                    }
                />
                <Checkbox
                    initialValue={false}
                    id={FilterOptions.FLAWLESS}
                    onChange={selected =>
                        handleInputChange(
                            "flawless",
                            AvailableFilterOptions[FilterOptions.FLAWLESS],
                            selected
                        )
                    }
                />
                <Checkbox
                    initialValue={false}
                    id={FilterOptions.LOWMAN}
                    onChange={selected =>
                        handleInputChange(
                            "lowman",
                            AvailableFilterOptions[FilterOptions.LOWMAN],
                            selected
                        )
                    }
                />
                <Checkbox
                    initialValue={false}
                    id={FilterOptions.SOLO}
                    onChange={selected =>
                        handleInputChange(
                            "solo",
                            AvailableFilterOptions[FilterOptions.SOLO],
                            selected
                        )
                    }
                />

                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

const Checkbox = ({
    initialValue,
    id,
    onChange
}: {
    initialValue: boolean
    id: FilterOptions
    onChange: (selected: boolean) => void
}) => {
    const { strings } = useLocale()
    const [value, setValue] = useState(initialValue)
    return (
        <div>
            <input
                type="checkbox"
                id={id}
                name={id}
                checked={value}
                onChange={e => {
                    setValue(val => {
                        const newVal = !val
                        onChange(newVal)
                        return newVal
                    })
                }}
            />
            <label htmlFor={id}>{strings.activityFilters[id]}</label>
        </div>
    )
}

export default FilterSelector
