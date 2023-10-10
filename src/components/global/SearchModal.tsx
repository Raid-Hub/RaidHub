import { useCallback, useRef, useState } from "react"
import styles from "../../styles/searchmodal.module.css"
import { useSearch } from "../../hooks/bungie/useSearch"
import { animate, AnimationSequence } from "framer-motion"
import { useTypewriter } from "react-simple-typewriter"
import { useKeyPress } from "../../hooks/util/useKeyPress"
import Link from "next/link"
import { useRouter } from "next/router"
import Loader from "~/components/reusable/Loader"
type SearchModalProps = {}

const SearchModal = ({}: SearchModalProps) => {
    const [isDivDisplayed, setIsDivDisplayed] = useState(false)
    const [showingResults, setShowingResults] = useState(false)
    const [isRedirecting, setIsRedirecting] = useState(false)

    const containerDiv = useRef<HTMLDivElement>(null)
    const backgroundDiv = useRef<HTMLDivElement>(null)
    const animateModal = useRef<HTMLDivElement>(null)

    const router = useRouter()
    const loadingRef = useRef(null)

    const animateModalIn = () => {
        setShowingResults(true)
        if (containerDiv.current) {
            animate(containerDiv.current, { opacity: [0, 1] }, { type: "spring", duration: 1.1 })
        }
        setIsDivDisplayed(true)
    }

    const animateModalOut = async () => {
        if (backgroundDiv.current && animateModal.current) {
            const sequence: AnimationSequence = [
                [animateModal.current, { opacity: [1, 0] }, { type: "spring", duration: 0.2 }],
                [backgroundDiv.current, { opacity: [1, 0] }, { type: "spring", duration: 0.6 }]
            ]
            await animate(sequence).then(() => {
                setIsDivDisplayed(false)
            })
        }
    }

    const {
        enteredText,
        results,
        isLoading: isLoadingResults,
        isPerformingExactSearch: isPerformingExactSearch,
        handleFormEnter,
        handleInputChange,
        clearQuery
    } = useSearch({
        errorHandler: console.error /** TODO: Handle search bar errors */,
        onSuccessfulExactSearch: userInfo => {
            setShowingResults(false)
            setIsRedirecting(true)
            animateModalOut()
            router.push(
                "/profile/[destinyMembershipType]/[destinyMembershipId]",
                `/profile/${userInfo.membershipType}/${userInfo.membershipId}`
            )
        }
    })

    const handleK = useCallback(async () => {
        if (isDivDisplayed) {
            await animateModalOut()
        } else {
            animateModalIn()
        }
    }, [isDivDisplayed])

    useKeyPress({
        pressedKey: "k",
        ctrlOrMeta: true,
        preventDefault: true,
        handleEvent: handleK
    })

    useKeyPress({
        pressedKey: "Escape",
        disabled: !isDivDisplayed,
        handleEvent: animateModalOut
    })

    return (
        <div
            ref={containerDiv}
            className={styles["container"]}
            style={{ display: isDivDisplayed ? "block" : "none" }}>
            {isDivDisplayed && (
                <div ref={animateModal} className={styles["search-modal"]} id="searchmodal">
                    <div className={styles["search-top"]}>
                        <form className={styles["search-form"]} onSubmit={handleFormEnter}>
                            <Input
                                enteredText={enteredText}
                                handleInputChange={handleInputChange}
                            />
                        </form>
                        <div className={styles["search-loading-indicator"]}>
                            {(isPerformingExactSearch || isRedirecting || isLoadingResults) && (
                                <Loader stroke={2} />
                            )}
                        </div>
                        <div className={styles["search-top-right"]}>
                            {/* <Image src={Search } alt="search" width={20} height={20} /> */}
                        </div>
                    </div>
                    <hr />
                    <div className={styles["search-content"]}>
                        <span>Search Results</span>
                        {showingResults && (
                            <ul className={styles["search-results"]}>
                                {results.map(({ name, membershipId, membershipType }, idx) => (
                                    <Link
                                        className={styles["search-result"]}
                                        key={idx}
                                        href={`/profile/${membershipType}/${membershipId}`}
                                        onClick={() => {
                                            animateModalOut()
                                            clearQuery()
                                        }}>
                                        <li>
                                            <div className={styles["individual-result"]}>
                                                {/* <Image
                                                    width={45}
                                                    height={45}
                                                    alt={name}
                                                    src={Question_Mark}
                                                /> */}
                                                <p>{name}</p>
                                            </div>
                                        </li>
                                    </Link>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
            {isDivDisplayed && (
                <div
                    ref={backgroundDiv}
                    className={styles["darken-background"]}
                    onClick={() => {
                        animateModalOut()
                    }}
                />
            )}
        </div>
    )
}

function Input({
    enteredText,
    handleInputChange
}: {
    enteredText: string
    handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void
}) {
    const [typeWriterText, count] = useTypewriter({
        words: ["Search for a Guardian..."],
        loop: true,
        delaySpeed: 2000
    })

    return (
        <input
            autoFocus
            id={styles["search-bar"]}
            type="text"
            name="search"
            autoComplete="off"
            placeholder={typeWriterText}
            value={enteredText}
            onChange={handleInputChange}
        />
    )
}

export default SearchModal
