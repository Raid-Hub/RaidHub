import styles from "../../styles/pages/home.module.css"
import {useRaidHubSearch} from "~/hooks/raidhub/useRaidHubSearch";
import {useState} from "react";
import Loader from "~/components/reusable/Loader";
import Search from "~/images/icons/Search";
import {useTypewriter} from "react-simple-typewriter";

const HomeSearch = () => {
    const [showingResults, setShowingResults] = useState(false)
    const [isRedirecting, setIsRedirecting] = useState(false)
    const [isSearchFocused, setIsSearchFocused] = useState(false)

    const handleFocus = () => {
        setIsSearchFocused(!isSearchFocused)
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
            <div className={
                isSearchFocused
                    ? [styles["search-bar-container-focused"], styles["search-bar-container"]].join(" ")
                    : styles["search-bar-container"]}
            >
                <div className={styles["search-icon"]}>
                    {isLoadingResults || isRedirecting ? (
                        <Loader stroke={2}/>
                    ) : (
                        <Search color="white"/>
                    )}
                </div>
                <form className={styles["search-bar-form"]}>
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
            {isSearchFocused &&
                <>
                    <div className={styles["divider"]}/>
                    <div className={styles["search-result-container"]}>
                    {/* TODO render resuts here*/}
                    </div>
                </>
            }
        </div>
    )
}

export default HomeSearch
