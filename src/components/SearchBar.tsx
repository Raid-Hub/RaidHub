import { useEffect, useRef, useState } from "react"
import styles from "../styles/header.module.css"
import { useSearch } from "../hooks/search"
import { fixBungieCode } from "../util/formatting"
import { Icons } from "../util/icons"
import { wait } from "../util/math"

const DEBOUNCE = 250
const HIDE_AFTER_CLICK = 100

type SearchBarProps = {}

const SearchBar = ({}: SearchBarProps) => {
    const [isRedirecting, setIsRedirecting] = useState(false)
    const [query, setQuery] = useState("")
    const [enteredText, setEnteredText] = useState("")
    const nextQuery = useRef("")
    const {
        results,
        isLoading: isLoadingResults,
        doExactSearch,
        isPerformingExactSearch
    } = useSearch({ query, errorHandler: () => {} /** TODO: Handle search bar errors */ })
    const [showingResults, setShowingResults] = useState(false)
    const searchContainerRef = useRef<HTMLDivElement>(null)

    const debounceQuery = async (potentialQuery: string) => {
        await wait(DEBOUNCE)
        if (!isPerformingExactSearch && potentialQuery === nextQuery.current) {
            setQuery(potentialQuery)
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = event.target.value
        setEnteredText(newQuery)
        nextQuery.current = newQuery
        debounceQuery(newQuery)
    }

    const handleSelect = (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setIsRedirecting(true)
        setQuery("")
        setTimeout(() => {
            setShowingResults(false)
        }, HIDE_AFTER_CLICK)
    }

    const handleFormEnter = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            setShowingResults(false)
            await doExactSearch(enteredText)
        } catch (e: any) {
            setShowingResults(true)
            nextQuery.current = enteredText
            setQuery(enteredText)
        }
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
            <div className={styles["search-icon"]}>
                {isPerformingExactSearch || isLoadingResults || isRedirecting ? (
                    <div className={styles["loader"]} />
                ) : (
                    <img className={styles["search-img"]} src={Icons.SEARCH} alt="search" />
                )}
            </div>
            <form onSubmit={handleFormEnter}>
                <input
                    id={styles["search-bar"]}
                    type="text"
                    placeholder="Search for a Guardian"
                    value={enteredText}
                    onChange={handleInputChange}
                />
                {showingResults && (
                    <ul className={styles["search-results"]}>
                        {results
                            .filter(
                                ({
                                    bungieGlobalDisplayName,
                                    bungieGlobalDisplayNameCode,
                                    displayName
                                }) =>
                                    (bungieGlobalDisplayName && bungieGlobalDisplayNameCode
                                        ? `${bungieGlobalDisplayName}#${fixBungieCode(
                                              bungieGlobalDisplayNameCode
                                          )}`
                                        : displayName
                                    ).startsWith(enteredText)
                            )
                            .map(
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
                                        href={`/profile/${membershipType}/${membershipId}`}
                                        onClick={handleSelect}>
                                        <li>
                                            <p>
                                                {bungieGlobalDisplayName &&
                                                bungieGlobalDisplayNameCode
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
            </form>
        </div>
    )
}

export default SearchBar
