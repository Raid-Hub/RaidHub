import { useEffect, useRef, useState } from "react"
import styles from "../styles/header.module.css"
import { useSearch } from "../hooks/search"
import { fixBungieCode, wait } from "../util/math"
import Link from "next/link"

const DEBOUNCE = 250
const HIDE_AFTER_CLICK = 200

type SearchBarProps = {}

const SearchBar = ({}: SearchBarProps) => {
    const [query, setQuery] = useState("")
    const [enteredText, setEnteredText] = useState("")
    const nextQuery = useRef("")
    const { results, isLoading: isLoadingResults } = useSearch(query)
    const [showingResults, setShowingResults] = useState(false)
    const searchContainerRef = useRef<HTMLDivElement>(null)

    const debounceQuery = async (potentialQuery: string) => {
        await wait(DEBOUNCE)
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

    const handleFormEnter = (event: React.FormEvent<HTMLFormElement>) => {
        nextQuery.current = enteredText
        setQuery(enteredText)
        event.preventDefault()
    }

    const handleSelect = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setTimeout(() => {
            setShowingResults(false)
            setQuery("")
            setEnteredText("")
        }, HIDE_AFTER_CLICK)
    }

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            setShowingResults(
                !searchContainerRef.current ||
                    searchContainerRef.current.contains(event.target as Node)
            )
        }

        document.addEventListener("mousedown", handleClick)

        return () => {
            document.removeEventListener("mousedown", handleClick)
        }
    }, [searchContainerRef])

    return (
        <div className={styles["search-container"]} ref={searchContainerRef}>
            <form onSubmit={handleFormEnter}>
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
                            <a
                                className={styles["search-result"]}
                                key={idx}
                                rel="noopener noreferrer"
                                href={`/profile/${membershipType}/${membershipId}`}
                                onClick={handleSelect}>
                                <li>
                                    <p>
                                        {bungieGlobalDisplayName && bungieGlobalDisplayNameCode
                                            ? `${bungieGlobalDisplayName}#${fixBungieCode(
                                                  bungieGlobalDisplayNameCode
                                              )}`
                                            : displayName}
                                    </p>
                                </li>
                            </a>
                        )
                    )}
                </ul>
            )}
        </div>
    )
}

export default SearchBar
