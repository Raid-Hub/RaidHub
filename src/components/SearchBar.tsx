import { useEffect, useRef, useState } from "react"
import styles from "../styles/header.module.css"
import { useSearch } from "../hooks/search"
import { asBungieName, fixBungieCode, wait } from "../util/math"
import Link from "next/link"
import { useRouter } from "next/router"
import { shared as client } from "../util/http/bungie"

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
    const router = useRouter()

    const debounceQuery = async (potentialQuery: string) => {
        await wait(DEBOUNCE)
        if (potentialQuery === nextQuery.current) {
            setQuery(potentialQuery)
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowingResults(true)
        const newQuery = event.target.value
        setEnteredText(newQuery)
        nextQuery.current = newQuery
        debounceQuery(newQuery)
    }

    const handleSelect = (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setTimeout(() => {
            setShowingResults(false)
            setQuery("")
            setEnteredText("")
        }, HIDE_AFTER_CLICK)
    }

    const handleFormEnter = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const bungieName = asBungieName(enteredText)
        if (bungieName) {
            try {
                const [user] = await client.searchByBungieName(...bungieName)
                if (user) {
                    router.push(`/profile/${user.membershipType}/${user.membershipId}`)
                    router.reload()
                    setShowingResults(false)
                    return
                }
            } catch (e) {
                // do nothing
            }
        }
        nextQuery.current = enteredText
        setQuery(enteredText)
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
