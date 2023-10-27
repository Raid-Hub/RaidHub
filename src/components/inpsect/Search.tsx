import styles from "~/styles/pages/inpsect.module.css"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { bungieIconUrl } from "~/util/destiny/bungie-icons"
import { useRaidHubSearch } from "~/hooks/raidhub/useRaidHubSearch"
import BungieName from "~/models/BungieName"

export default function Search({ addMember }: { addMember: (membershipId: string) => void }) {
    const ref = useRef<HTMLDivElement>(null)

    const { enteredText, results, handleFormEnter, handleInputChange } = useRaidHubSearch({
        onRedirect: result => {
            setIsShowingResults(false)
            addMember(result.membershipId)
        }
    })

    const [isShowingResults, setIsShowingResults] = useState(false)

    // control the hiding of the search bar
    useEffect(() => {
        if (isShowingResults) {
            const handleClickOutside = (e: MouseEvent) => {
                if (!ref.current?.parentNode?.contains(e.target as Node)) {
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
                    {results.map(
                        (
                            {
                                bungieGlobalDisplayName,
                                bungieGlobalDisplayNameCode,
                                iconPath,
                                displayName,
                                membershipId
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
                                <li
                                    key={idx}
                                    className={styles["search-result"]}
                                    onClick={() => {
                                        addMember(membershipId)
                                        setIsShowingResults(false)
                                    }}>
                                    <Image
                                        width={45}
                                        height={45}
                                        alt={username}
                                        unoptimized
                                        src={bungieIconUrl(iconPath)}
                                    />
                                    <p>{username}</p>
                                </li>
                            )
                        }
                    )}
                </ol>
            )}
        </div>
    )
}
