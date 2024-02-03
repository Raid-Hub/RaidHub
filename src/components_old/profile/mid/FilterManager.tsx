import styles from "~/styles/pages/profile/mid.module.css"
import PreviousArrow from "~/images/icons/PreviousArrow"
import { ActivityFilter } from "~/types/profile"
import { Collection } from "@discordjs/collection"

export default function CustomFilterManager({
    returnToMain,
    savedFilters,
    deleteFilter
}: {
    returnToMain(): void
    savedFilters: Collection<string, ActivityFilter>
    deleteFilter(name: string): void
}) {
    return (
        <div className={styles["filter-selector-builder"]}>
            <nav className={styles["filter-selector-nav"]} onClick={returnToMain}>
                <PreviousArrow
                    color="white"
                    sx={20}
                    className={styles["filter-selector-nav-arrow"]}
                />
                <span>Back</span>
            </nav>
            <h3>Manage Filters</h3>
            <div>
                {savedFilters.map((_, filterName) => (
                    <SavedFilterComponent
                        key={filterName}
                        filterName={filterName}
                        remove={() => deleteFilter(filterName)}
                    />
                ))}
            </div>
        </div>
    )
}

const SavedFilterComponent = ({ filterName, remove }: { filterName: string; remove(): void }) => {
    return (
        <div className={styles["filter-manager-component"]}>
            <p>{filterName}</p>
            <button className={styles["filter-selector-builder-button"]} disabled aria-disabled>
                Edit
            </button>
            <button
                onClick={remove}
                className={styles["filter-selector-builder-button"]}
                style={{ backgroundColor: "var(--destructive)" }}>
                Delete
            </button>
        </div>
    )
}
