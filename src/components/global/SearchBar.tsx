import { useEffect, useRef, useState } from "react"
import styles from "../../styles/header.module.css"
import { useSearch } from "../../hooks/bungie/useSearch"
import { Search } from "../../images/icons"
import { wait } from "../../util/wait"
import BungieName from "../../models/BungieName"
import Image from "next/image"

const DEBOUNCE = 250
const HIDE_AFTER_CLICK = 100

type SearchBarProps = {}

const SearchBar = ({}: SearchBarProps) => {
    const [isRedirecting, setIsRedirecting] = useState(false)
    const [query, setQuery] = useState("")
    const [enteredText, setEnteredText] = useState("")
    const nextQuery = useRef("")
    const [OSKey, setOSKey] = useState("Ctrl")

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
        // Surely this detects if the user is on Mac :pleading:
        if (navigator.userAgent.includes("Mac")) {
            setOSKey("⌘")
        }

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

    // setTimeout(() => {
    //     setIsRedirecting(!isRedirecting)
    // }, 200)

    return (
        <div className={styles["search-container"]} ref={searchContainerRef}>
            <div className={styles["search-icon"]}>
                {isPerformingExactSearch || isLoadingResults || isRedirecting ? (
                    <div className={styles["loader"]} />
                ) : (
                    <Image className={styles["search-img"]} src={Search} alt="search" />
                )}
            </div>
            <form onSubmit={handleFormEnter}>
                <input
                    id={styles["search-bar"]}
                    type="text"
                    name="search"
                    autoComplete="off"
                    placeholder="Search for a Guardian..."
                    value={enteredText}
                    onChange={handleInputChange}
                />
                <kbd className={styles["keys"]}>{OSKey}</kbd>{" "}
                <span className={styles["keys"]}>+</span>
                <kbd className={styles["keys"]}>K</kbd>
                {showingResults && (
                    <ul className={styles["search-results"]}>
                        {results
                            .map(result => {
                                let name = result.displayName
                                if (
                                    result.bungieGlobalDisplayName &&
                                    result.bungieGlobalDisplayNameCode
                                )
                                    try {
                                        name = new BungieName(
                                            result.bungieGlobalDisplayName,
                                            result.bungieGlobalDisplayNameCode
                                        ).toString()
                                    } catch {}
                                return {
                                    ...result,
                                    name
                                }
                            })
                            .filter(({ name }) => name.startsWith(enteredText))
                            .map(({ name, membershipId, membershipType }, idx) => (
                                <a
                                    className={styles["search-result"]}
                                    key={idx}
                                    href={`/profile/${membershipType}/${membershipId}`}
                                    onClick={handleSelect}>
                                    <li>
                                        <p>{name}</p>
                                    </li>
                                </a>
                            ))}
                    </ul>
                )}
            </form>
        </div>
    )
}

export default SearchBar
