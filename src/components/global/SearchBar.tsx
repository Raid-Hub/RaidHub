import { useEffect, useRef, useState } from "react"
import styles from "../../styles/header.module.css"
import { useSearch } from "../../hooks/bungie/useSearch"
import Link from "next/link"
import { useRouter } from "next/router"
import Loader from "../reusable/Loader"

const HIDE_AFTER_CLICK = 100

type SearchBarProps = {}

const SearchBar = ({}: SearchBarProps) => {
    const [isRedirecting, setIsRedirecting] = useState(false)
    const [OSKey, setOSKey] = useState("Ctrl")

    const router = useRouter()

    const {
        enteredText,
        results,
        isLoading: isLoadingResults,
        isPerformingExactSearch,
        handleFormEnter,
        handleInputChange,
        clearQuery
    } = useSearch({
        errorHandler: console.error /** TODO: Handle search bar errors */,
        onSuccessfulExactSearch: userInfo => {
            setIsShowingResults(false)
            setIsRedirecting(true)
            router.push(
                "/profile/[destinyMembershipType]/[destinyMembershipId]",
                `/profile/${userInfo.membershipType}/${userInfo.membershipId}`
            )
        }
    })
    const [isShowingResults, setIsShowingResults] = useState(false)
    const searchContainerRef = useRef<HTMLDivElement>(null)

    const handleSelect = (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setIsRedirecting(true)
        clearQuery()
        setTimeout(() => {
            setIsShowingResults(false)
        }, HIDE_AFTER_CLICK)
    }

    useEffect(() => {
        const eventName = "routeChangeComplete"
        const removeRedirecting = () => setIsRedirecting(false)
        router.events.on(eventName, removeRedirecting)
        return () => {
            router.events.off(eventName, removeRedirecting)
        }
    })

    useEffect(() => {
        // Surely this detects if the user is on Mac :pleading:
        if (navigator.userAgent.includes("Mac")) {
            setOSKey("⌘")
        }
    }, [searchContainerRef])

    useEffect(() => {
        if (isShowingResults) {
            const handleClick = (event: MouseEvent) => {
                setIsShowingResults(
                    !searchContainerRef.current ||
                        searchContainerRef.current.contains(event.target as Node)
                )
            }

            if (isShowingResults) {
            }
            document.addEventListener("click", handleClick)
            return () => {
                document.removeEventListener("click", handleClick)
            }
        }
    }, [isShowingResults])

    return (
        <div className={styles["search-container"]} ref={searchContainerRef}>
            <div className={styles["search-icon"]}>
                {
                    isPerformingExactSearch || isLoadingResults || isRedirecting ? <Loader /> : null
                    // <Image
                    //     className={styles["search-img"]}
                    //     src={Search}
                    //     alt="search"
                    //     width={15}
                    //     height={15}
                    // />
                }
            </div>
            <form onSubmit={handleFormEnter}>
                <input
                    id={styles["search-bar"]}
                    type="text"
                    name="search"
                    autoComplete="off"
                    placeholder="Search for a Guardian..."
                    value={enteredText}
                    onClick={() => setIsShowingResults(true)}
                    onChange={handleInputChange}
                />
                <div className={styles["keys"]}>
                    <kbd>{OSKey}</kbd>
                    <span>+</span>
                    <kbd>K</kbd>
                </div>
                {isShowingResults && (
                    <ul className={styles["search-results"]}>
                        {results.map(({ name, membershipId, membershipType }, idx) => (
                            <Link
                                className={styles["search-result"]}
                                key={idx}
                                href={`/profile/${membershipType}/${membershipId}`}
                                onClick={handleSelect}>
                                <li>
                                    <p>{name}</p>
                                </li>
                            </Link>
                        ))}
                    </ul>
                )}
            </form>
        </div>
    )
}

export default SearchBar
