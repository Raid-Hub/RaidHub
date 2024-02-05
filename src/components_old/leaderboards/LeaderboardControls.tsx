import Image from "next/image"
import { useRef, useState } from "react"
import { z } from "zod"
import { useRaidHubSearch } from "~/hooks/raidhub/useRaidHubSearch"
import { useClickOutside } from "~/hooks/util/useClickOutside"
import { useSearchParams } from "~/hooks/util/useSearchParams"
import NextArrow from "~/images/icons/NextArrow"
import PreviousArrow from "~/images/icons/PreviousArrow"
import ReloadArrow from "~/images/icons/ReloadArrow"
import styles from "~/styles/pages/leaderboards.module.css"
import { RaidHubPlayerSearchResult } from "~/types/raidhub-api"
import { bungieIconUrl } from "~/util/destiny/bungie-icons"
import { getUserName } from "~/util/destiny/bungieName"
import Loader from "../../components/Loader"

export const Controls = ({
    isLoading,
    entriesLength,
    entriesPerPage,
    currentPage,
    refresh,
    handleBackwards,
    handleForwards,
    searchFn
}: {
    entriesLength: number
    entriesPerPage: number
    isLoading: boolean
    currentPage: number
    refresh: () => void
    handleBackwards: () => void
    handleForwards: () => void
    searchFn?: (membershipId: string) => void
}) => {
    const searchRef = useRef<HTMLFormElement>(null)
    const [isShowingResults, setIsShowingResults] = useState(false)
    const [selected, setSelected] = useState<RaidHubPlayerSearchResult | null>(null)

    const handleClickAway = () => {
        setIsShowingResults(false)
    }

    useClickOutside({ ref: searchRef, lockout: 200, enabled: true }, handleClickAway)

    const canGoForward = isLoading || entriesLength === entriesPerPage
    const canGoBack = currentPage > 1

    const {
        set: setParam,
        isReady,
        remove: removeParam
    } = useSearchParams({
        decoder: q => z.object({ player: z.coerce.string() }).parse(q)
    })
    const {
        enteredText,
        results,
        isLoading: isLoadingSearch,
        handleInputChange,
        handleFormEnter,
        clearQuery
    } = useRaidHubSearch()
    return (
        <div className={styles["leaderboard-controls"]}>
            {searchFn && (
                <form
                    onSubmit={handleFormEnter}
                    style={{ position: "relative" }}
                    ref={searchRef}
                    onClick={() => setIsShowingResults(true)}>
                    <div
                        style={{
                            display: "flex",
                            gap: "1em",
                            marginRight: "0.5em"
                        }}>
                        {isLoadingSearch && <Loader stroke={3.5} size="30px" />}
                        {selected && isReady && (
                            <button
                                onClick={() => {
                                    setSelected(null), removeParam("player")
                                }}>
                                Clear
                            </button>
                        )}
                        <input
                            style={{ height: "30px" }}
                            type="text"
                            value={enteredText}
                            placeholder={
                                selected ? getUserName(selected) : "Search the leaderboards"
                            }
                            onChange={handleInputChange}
                        />
                    </div>
                    {!!results.length && isShowingResults && isReady && (
                        <div className={styles["search-results"]}>
                            {results.map((result, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => {
                                        setParam("player", result.membershipId)
                                        searchFn(result.membershipId)
                                        clearQuery()
                                        setSelected(result)
                                    }}
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "0.5em",
                                        alignItems: "center",
                                        padding: "1em 1em"
                                    }}>
                                    <div
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            position: "relative"
                                        }}>
                                        <Image
                                            src={bungieIconUrl(result.iconPath)}
                                            unoptimized
                                            fill
                                            alt={""}
                                        />
                                    </div>
                                    <span
                                        style={{
                                            marginLeft: "0.5em"
                                        }}>
                                        {getUserName(result)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </form>
            )}
            <ReloadArrow
                color="white"
                sx={25}
                onClick={refresh}
                className={styles["btn-control"]}
            />
            <PreviousArrow
                color={canGoBack ? "white" : "gray"}
                sx={20}
                aria-disabled={!canGoBack}
                onClick={canGoBack ? handleBackwards : undefined}
                className={styles["btn-control"]}
            />
            <NextArrow
                color={canGoForward ? "white" : "gray"}
                sx={20}
                aria-disabled={!canGoForward}
                onClick={canGoForward ? handleForwards : undefined}
                className={styles["btn-control"]}
            />
        </div>
    )
}
