import { useEffect, useRef, useState } from "react"
import styles from "../styles/header.module.css"
import { useSearch } from "../hooks/search"
import { wait } from "../util/math"
import { CustomBungieSearchResult } from "../util/types"

const DEBOUNCE_CONSTANT = 250

type SearchBarProps = {
    onResults: (results: CustomBungieSearchResult[]) => void
}

const SearchBar = ({ onResults }: SearchBarProps) => {
    const [query, setQuery] = useState("")
    const [enteredText, setEnteredText] = useState("")
    const nextQuery = useRef("")
    const { results, isLoading: isLoadingResults } = useSearch(query)

    const debounceQuery = async (potentialQuery: string) => {
        await wait(DEBOUNCE_CONSTANT)
        if (potentialQuery === nextQuery.current) {
            setQuery(potentialQuery)
        }
    }

    useEffect(() => {
        onResults(results)
    }, [results])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = event.target.value
        setEnteredText(newQuery)
        nextQuery.current = newQuery
        debounceQuery(newQuery)
    }

    return (
        <form
            onSubmit={e => {
                e.preventDefault()
            }}
        >
            <input
                id={styles["search-bar"]}
                type="text"
                placeholder="Search for a Guardian"
                value={enteredText}
                onChange={handleInputChange}
            />
        </form>
    )
}

export default SearchBar
