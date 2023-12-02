import styles from "../../styles/pages/home.module.css"
import { useRaidHubSearch } from "~/hooks/raidhub/useRaidHubSearch"
import { useState } from "react"
import Search from "~/images/icons/Search"
import { useTypewriter } from "react-simple-typewriter"
import BungieName from "~/models/BungieName"
import Link from "next/link"
import Image from "next/image"
import { bungieIconUrl } from "~/util/destiny/bungie-icons"

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
                            {results.map(
                                (
                                    {
                                        bungieGlobalDisplayName,
                                        bungieGlobalDisplayNameCode,
                                        displayName,
                                        membershipId,
                                        membershipType,
                                        iconPath
                                    },
                                    idx
                                ) => {
                                    let username = displayName
                                    try {
                                        const b = new BungieName(
                                            bungieGlobalDisplayName,
                                            bungieGlobalDisplayNameCode
                                        )
                                        username = b.toString()
                                    } catch {}
                                    return (
                                        <Link
                                            key={idx}
                                            href={`/profile/${membershipType}/${membershipId}`}
                                            onClick={() => {
                                                clearQuery()
                                            }}>
                                            <li>
                                                <div className={styles["individual-result"]}>
                                                    <Image
                                                        width={35}
                                                        height={35}
                                                        alt={username}
                                                        unoptimized
                                                        src={bungieIconUrl(iconPath)}
                                                    />
                                                    <p>{username}</p>
                                                </div>
                                            </li>
                                        </Link>
                                    )
                                }
                            )}
                        </ul>
                    </div>
                </>
            )}
        </div>
    )
}

export default HomeSearch
