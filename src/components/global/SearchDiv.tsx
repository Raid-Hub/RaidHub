import { useCallback, useRef, useState } from "react"
import styles from "../../styles/searchdiv.module.css"
import { Question_Mark, Search } from "../../images/icons"
import Image from "next/image"
import { useSearch } from "../../hooks/bungie/useSearch"
import { animate, AnimationSequence } from "framer-motion"
import { useTypewriter } from "react-simple-typewriter"
import { useKeyPress } from "../../hooks/util/useKeyPress"
import Link from "next/link"

type SearchDivProps = {}

const SearchDiv = ({}: SearchDivProps) => {
    const [isDivDisplayed, setIsDivDisplayed] = useState(false)

    const [showingResults, setShowingResults] = useState(false)

    const backgroundDiv = useRef<HTMLDivElement>(null)
    const animateModal = useRef<HTMLDivElement>(null)

    const animateModalIn = () => {
        setShowingResults(true)
        if (animateModal.current) {
            animate(animateModal.current, { opacity: [0, 1] }, { type: "spring", duration: 1.5 })
        }
        setIsDivDisplayed(true)
        document.body.style.overflow = "hidden"
    }

    const animateModalOut = async () => {
        if (backgroundDiv.current && animateModal.current) {
            const sequence: AnimationSequence = [
                [animateModal.current, { opacity: [1, 0] }, { type: "spring", duration: 0.2 }],
                [backgroundDiv.current, { opacity: [1, 0] }, { type: "spring", duration: 0.6 }]
            ]
            await animate(sequence).then(() => {
                setIsDivDisplayed(false)
                document.body.style.overflow = ""
            })
        }
    }

    const {
        enteredText,
        results,
        isLoading: isLoadingResults,
        handleFormEnter,
        handleInputChange,
        clearQuery
    } = useSearch({
        errorHandler: console.error, // todo
        onSuccessfulExactSearch: animateModalOut
    })

    const handleK = useCallback(async () => {
        if (isDivDisplayed == true) {
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
        <div className={styles["container"]}>
            <div className={styles["animate-modal"]} ref={animateModal}>
                {isDivDisplayed && (
                    <div className={styles["search-div"]} id="searchdiv">
                        <div className={styles["search-top"]}>
                            <form className={styles["search-form"]} onSubmit={handleFormEnter}>
                                <Input
                                    enteredText={enteredText}
                                    handleInputChange={handleInputChange}
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
                                                    <Image
                                                        width={45}
                                                        height={45}
                                                        alt={name}
                                                        src={Question_Mark}
                                                    />
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
            </div>
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

export default SearchDiv
