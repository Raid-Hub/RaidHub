import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useTypewriter } from "react-simple-typewriter"
import { useRaidHubSearch } from "~/hooks/raidhub/useRaidHubSearch"
import Search from "~/images/icons/Search"
import { bungieIconUrl } from "~/util/destiny/bungie-icons"
import { getUserName } from "~/util/destiny/bungieName"
import styles from "../../styles/pages/home.module.css"

const HomeSearch = () => {
    const [showingResults, setShowingResults] = useState(false)
    const [isRedirecting, setIsRedirecting] = useState(false)
    const [isSearchFocused, setIsSearchFocused] = useState(false)

    const handleFocus = () => {
        // timeout to circumvent the loss of focus, which closes the search before redirecting starts
        setTimeout(() => setIsSearchFocused(!isSearchFocused), 100)
    }

    const {
        enteredText,
        results,
        isLoading: isLoadingResults,
        handleFormEnter,
        handleInputChange,
        clearQuery
    } = useRaidHubSearch({
        onRedirect: () => {
            setShowingResults(false)
            setIsRedirecting(true)
        }
    })

    const [typeWriterText, count] = useTypewriter({
        words: ["Search for a Guardian..."],
        typeSpeed: 200,
        deleteSpeed: 100,
        loop: true,
        delaySpeed: 2000
    })

    return (
        <div className={styles["search"]}>
            <div
                className={
                    isSearchFocused
                        ? [
                              styles["search-bar-container-focused"],
                              styles["search-bar-container"]
                          ].join(" ")
                        : styles["search-bar-container"]
                }>
                <div className={styles["search-icon"]}>
                    <Search color="white" />
                </div>
                <form className={styles["search-bar-form"]} onSubmit={handleFormEnter}>
                    <input
                        className={styles["search-bar"]}
                        type="text"
                        name="search"
                        autoComplete="off"
                        placeholder={typeWriterText}
                        value={enteredText}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleFocus}
                    />
                </form>
            </div>
            {isSearchFocused && (
                <>
                    <div className={styles["search-result-container"]}>
                        <ul className={styles["search-results"]}>
                            {results.map((user, idx) => (
                                <Link
                                    key={idx}
                                    href={`/profile/${user.membershipType || 0}/${
                                        user.membershipId
                                    }`}
                                    onClick={() => {
                                        clearQuery()
                                    }}>
                                    <li>
                                        <div className={styles["individual-result"]}>
                                            <Image
                                                width={35}
                                                height={35}
                                                alt={getUserName(user)}
                                                unoptimized
                                                src={bungieIconUrl(user.iconPath)}
                                            />
                                            <p>{getUserName(user)}</p>
                                        </div>
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    )
}

export default HomeSearch
