import { useEffect, useRef, useState } from "react"
import styles from "../../styles/searchdiv.module.css"
import { Search } from "../../images/icons";
import Image from "next/image";
import { useSearch } from "../../hooks/bungie/useSearch"
import { wait } from "../../util/wait"
import BungieName from "../../models/BungieName"

const DEBOUNCE = 250
const HIDE_AFTER_CLICK = 100

type SearchDivProps = {}

const SearchDiv = ({}: SearchDivProps) => {
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

    // setTimeout(() => {
    //     setIsRedirecting(!isRedirecting)
    // }, 200)
    const [isDivDisplayed, setIsDivDisplayed] = useState(false);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'k') {
        console.log("Pressed")
        setIsDivDisplayed(!isDivDisplayed);
        if (isDivDisplayed == true) {
            document.getElementById("searchdiv")?.remove();
        }
        event.preventDefault();
      }
    };
  
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', (event: MouseEvent) => {
            const target = event.target;
            if (!document.querySelector("searchdiv")?.contains(event.target as Node)) {
                console.log("Clicked Outside / Elsewhere");
            }
        })
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
      }, []);
  
      return (
        <div>
          {isDivDisplayed && (
            <div className={styles["search-div"]} id="searchdiv">
                <div className={styles["search-top"]}>
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
                </form>
                    <div className={styles["search-top-right"]}>
                        <Image src={Search} alt="search" />
                    </div>
                </div>
                <hr />
                <div className={styles["search-content"]}>
                    <span>Search Results</span>
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
                                            <div className={styles["individual-result"]}>
                                                <img src="https://media.discordapp.net/attachments/1119296539085520926/1132024697794592859/83cf97527216f53220933f08a85499f2.jpg" />
                                                <p>{name}</p>
                                            </div>
                                        </li>
                                    </a>
                                ))}
                        </ul>
                    )}
                </div>
            </div>
          )}

          {isDivDisplayed && <div className={styles["darken-background"]}></div>}
        </div>
      );
}

export default SearchDiv