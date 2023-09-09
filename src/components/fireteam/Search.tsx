import { useSearch } from "~/hooks/bungie/useSearch"
import styles from "~/styles/pages/fireteam.module.css"
import Image from "next/image"
import { Question_Mark } from "~/images/icons"
import { useEffect, useRef, useState } from "react"
import { Member } from "~/pages/fireteam"

export default function Search({ addMember }: { addMember: (member: Member) => void }) {
    const ref = useRef<HTMLDivElement>(null)

    const {
        enteredText,
        results,
        isLoading: isLoadingResults,
        handleFormEnter,
        handleInputChange,
        clearQuery
    } = useSearch({
        errorHandler: console.error, // todo
        onSuccessfulExactSearch: userInfo => {
            if (userInfo) {
                setIsShowingResults(false)
                addMember({
                    destinyMembershipId: userInfo.membershipId,
                    destinyMembershipType: userInfo.membershipType
                })
            }
        }
    })

    const [isShowingResults, setIsShowingResults] = useState(false)

    // control the hiding of the search bar
    useEffect(() => {
        if (isShowingResults) {
            const handleClickOutside = (e: MouseEvent) => {
                if (!ref.current?.contains(e.target as Node)) {
                    setIsShowingResults(false)
                }
            }

            document.addEventListener("click", handleClickOutside)

            return () => {
                document.removeEventListener("click", handleClickOutside)
            }
        } else {
            const handleClickIn = (e: MouseEvent) => {
                if (ref.current?.contains(e.target as Node)) {
                    setIsShowingResults(true)
                }
            }

            document.addEventListener("click", handleClickIn)

            return () => {
                document.removeEventListener("click", handleClickIn)
            }
        }
    }, [isShowingResults])

    return (
        <div className={styles["search"]} ref={ref}>
            <form onSubmit={handleFormEnter}>
                <input
                    autoFocus
                    type="text"
                    name="search"
                    autoComplete="off"
                    placeholder={"Search for a Guardian"}
                    value={enteredText}
                    onChange={handleInputChange}
                />
            </form>
            {isShowingResults && (
                <ol className={styles["search-results"]}>
                    {results.map(({ name, membershipId, membershipType }, idx) => (
                        <li
                            key={idx}
                            className={styles["search-result"]}
                            onClick={() => {
                                addMember({
                                    destinyMembershipId: membershipId,
                                    destinyMembershipType: membershipType
                                })
                                setIsShowingResults(false)
                            }}>
                            <Image width={45} height={45} alt={name} src={Question_Mark} />
                            <p>{name}</p>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    )
}
