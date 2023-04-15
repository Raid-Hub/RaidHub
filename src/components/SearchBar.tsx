import { useEffect, useRef, useState } from "react"
import styles from "../styles/header.module.css"
import { useSearch } from "../hooks/search"
import { fixBungieCode, wait } from "../util/math"
import { CustomBungieSearchResult } from "../util/types"
import Link from "next/link"

const DEBOUNCE_CONSTANT = 250

type SearchBarProps = {}

const SearchBar = ({}: SearchBarProps) => {
    const [query, setQuery] = useState("")
    const [enteredText, setEnteredText] = useState("")
    const nextQuery = useRef("")
    const { results, isLoading: isLoadingResults } = useSearch(query)
    const searchContainerRef = useRef<HTMLDivElement>(null)
    const [showingResults, setShowingResults] = useState(false)

    const debounceQuery = async (potentialQuery: string) => {
        await wait(DEBOUNCE_CONSTANT)
        if (potentialQuery === nextQuery.current) {
            setQuery(potentialQuery)
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = event.target.value
        setEnteredText(newQuery)
        nextQuery.current = newQuery
        debounceQuery(newQuery)
    }

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            setShowingResults(
                !(
                    searchContainerRef.current &&
                    !searchContainerRef.current.contains(event.target as Node)
                )
            )
        }

        document.addEventListener("mousedown", handleOutsideClick)

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick)
        }
    }, [searchContainerRef])

    return (
        <div className={styles["search-container"]} ref={searchContainerRef}>
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
            {showingResults && (
                <ul className={styles["search-results"]}>
                    {results.map(
                        (
                            {
                                bungieGlobalDisplayName,
                                bungieGlobalDisplayNameCode,
                                displayName,
                                membershipId,
                                membershipType
                            },
                            idx
                        ) => (
                            <Link
                                className={styles["search-result"]}
                                key={idx}
                                rel="noopener noreferrer"
                                href={`/profile/${membershipType}/${membershipId}`}
                                onClick={() => setTimeout(setShowingResults, 200, false)}
                            >
                                <li>
                                    <p>
                                        {bungieGlobalDisplayName && bungieGlobalDisplayNameCode
                                            ? `${bungieGlobalDisplayName}#${fixBungieCode(
                                                  bungieGlobalDisplayNameCode
                                              )}`
                                            : displayName}
                                    </p>
                                </li>
                            </Link>
                        )
                    )}
                </ul>
            )}
        </div>
    )
}

export default SearchBar
